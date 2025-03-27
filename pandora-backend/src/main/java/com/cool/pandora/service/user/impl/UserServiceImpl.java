package com.cool.pandora.service.user.impl;

import static com.cool.pandora.constant.UserConstant.USER_LOGIN_STATE;

import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.constant.CommonConstant;
import com.cool.pandora.constant.RedisConstant;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.mapper.UserMapper;
import com.cool.pandora.model.dto.user.UserQueryRequest;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.model.enums.AvatarEnum;
import com.cool.pandora.model.enums.UserRoleEnum;
import com.cool.pandora.model.vo.LoginUserVO;
import com.cool.pandora.model.vo.UserVO;
import com.cool.pandora.satoken.DeviceUtils;
import com.cool.pandora.service.user.UserService;
import com.cool.pandora.utils.SqlUtils;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.bean.WxOAuth2UserInfo;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RBitSet;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

/**
 * 用户服务实现

 */
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Resource
    private RedissonClient redissonClient;
    @Resource
    private RedisTemplate redisTemplate;

    /**
     * 盐值，混淆密码
     */
    public static final String SALT = "cool";

    @Override
    public long userRegister(String userAccount, String userPassword, String checkPassword) {
        // 1. 校验
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户账号过短");
        }
        if (userPassword.length() < 8 || checkPassword.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户密码过短");
        }
        // 密码和校验密码相同
        if (!userPassword.equals(checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "两次输入的密码不一致");
        }
        synchronized (userAccount.intern()) {
            // 账户不能重复
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("userAccount", userAccount);
            long count = this.baseMapper.selectCount(queryWrapper);
            if (count > 0) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号重复");
            }
            // 2. 加密
            String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());
            // 3. 插入数据
            User user = new User();
            //随机取个名字
            user.setUserName( "用户" + (int)(Math.random()*1000*1000));
            user.setUserRole(UserRoleEnum.USER.getValue());
            //随机从AvatarEnum中获取一个头像
            user.setUserAvatar(AvatarEnum.getRandomAvatar());
            user.setUserAccount(userAccount);
            user.setUserPassword(encryptPassword);
            boolean saveResult = this.save(user);
            if (!saveResult) {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "注册失败，数据库错误");
            }
            return user.getId();
        }
    }

    @Override
    public LoginUserVO userLogin(String userAccount, String userPassword, HttpServletRequest request) {
        // 1. 校验
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        if (userAccount.length() < 4) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "账号错误");
        }
        if (userPassword.length() < 8) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "密码错误");
        }
        // 2. 加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + userPassword).getBytes());
        // 查询用户是否存在
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userAccount", userAccount);
        queryWrapper.eq("userPassword", encryptPassword);
        User user = this.baseMapper.selectOne(queryWrapper);
        // 用户不存在
        if (user == null) {
            log.info("user login failed, userAccount cannot match userPassword");
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户不存在或密码错误");
        }
        // 3. 记录用户的登录态
//        request.getSession().setAttribute(USER_LOGIN_STATE, user);

        // 使用 Sa-Token 登录，并指定设备，同端登录互斥
        StpUtil.login(user.getId(), DeviceUtils.getRequestDevice(request));
        StpUtil.getSession().set(USER_LOGIN_STATE, user);
        return this.getLoginUserVO(user);
    }

    @Override
    public LoginUserVO userLoginByMpOpen(WxOAuth2UserInfo wxOAuth2UserInfo, HttpServletRequest request) {
        String unionId = wxOAuth2UserInfo.getUnionId();
        String mpOpenId = wxOAuth2UserInfo.getOpenid();
        // 单机锁
        synchronized (unionId.intern()) {
            // 查询用户是否已存在
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("unionId", unionId);
            User user = this.getOne(queryWrapper);
            // 被封号，禁止登录
            if (user != null && UserRoleEnum.BAN.getValue().equals(user.getUserRole())) {
                throw new BusinessException(ErrorCode.FORBIDDEN_ERROR, "该用户已被封，禁止登录");
            }
            // 用户不存在则创建
            if (user == null) {
                user = new User();
                user.setUnionId(unionId);
                user.setMpOpenId(mpOpenId);
                user.setUserAvatar(wxOAuth2UserInfo.getHeadImgUrl());
                user.setUserName(wxOAuth2UserInfo.getNickname());
                boolean result = this.save(user);
                if (!result) {
                    throw new BusinessException(ErrorCode.SYSTEM_ERROR, "登录失败");
                }
            }
            // 记录用户的登录态
            request.getSession().setAttribute(USER_LOGIN_STATE, user);
            return getLoginUserVO(user);
        }
    }

    /**
     * 获取当前登录用户
     *
     * @param request
     * @return
     */
    @Override
    public User getLoginUser(HttpServletRequest request) {
        // 先判断是否已登录
        Object loginUserId = StpUtil.getLoginIdDefaultNull();
        if (loginUserId == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
//        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
//        User currentUser = (User) userObj;
//        if (currentUser == null || currentUser.getId() == null) {
//            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
//        }
        // 从数据库查询（追求性能的话可以注释，直接走缓存）
//        long userId = currentUser.getId();
        User currentUser = this.getById((String) loginUserId);
        if (currentUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        return currentUser;
    }

    /**
     * 获取当前登录用户（允许未登录）
     *
     * @param request
     * @return
     */
    @Override
    public User getLoginUserPermitNull(HttpServletRequest request) {
        // 先判断是否已登录（基于 Sa-Token 实现）
        Object loginUserId = StpUtil.getLoginIdDefaultNull();
        if (loginUserId == null) {
            return null;
        }
//        // 先判断是否已登录
//        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
//        User currentUser = (User) userObj;
//        if (currentUser == null || currentUser.getId() == null) {
//            return null;
//        }
        // 从数据库查询（追求性能的话可以注释，直接走缓存）
//        long userId = currentUser.getId();
        return this.getById((String) loginUserId);
    }

    /**
     * 是否为管理员
     *
     * @param request
     * @return
     */
    @Override
    public boolean isAdmin(HttpServletRequest request) {
        // 仅管理员可查询
        // 基于 Sa-Token 改造
        Object userObj = StpUtil.getSession().get(USER_LOGIN_STATE);
//        Object userObj = request.getSession().getAttribute(USER_LOGIN_STATE);
        User user = (User) userObj;
        return isAdmin(user);
    }

    @Override
    public boolean isAdmin(User user) {
        return user != null && UserRoleEnum.ADMIN.getValue().equals(user.getUserRole());
    }

    /**
     * 用户注销
     *
     * @param request
     */
    @Override
    public boolean userLogout(HttpServletRequest request) {
        StpUtil.checkLogin();
        // 移除登录态
        StpUtil.logout();
//        if (request.getSession().getAttribute(USER_LOGIN_STATE) == null) {
//            throw new BusinessException(ErrorCode.OPERATION_ERROR, "未登录");
//        }
//        // 移除登录态
//        request.getSession().removeAttribute(USER_LOGIN_STATE);
        return true;
    }

    @Override
    public LoginUserVO getLoginUserVO(User user) {
        if (user == null) {
            return null;
        }
        LoginUserVO loginUserVO = new LoginUserVO();
        BeanUtils.copyProperties(user, loginUserVO);
        return loginUserVO;
    }

    @Override
    public UserVO getUserVO(User user) {
        if (user == null) {
            return null;
        }
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @Override
    public List<UserVO> getUserVO(List<User> userList) {
        if (CollUtil.isEmpty(userList)) {
            return new ArrayList<>();
        }
        return userList.stream().map(this::getUserVO).collect(Collectors.toList());
    }

    @Override
    public QueryWrapper<User> getQueryWrapper(UserQueryRequest userQueryRequest) {
        if (userQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        Long id = userQueryRequest.getId();
        String unionId = userQueryRequest.getUnionId();
        String mpOpenId = userQueryRequest.getMpOpenId();
        String userName = userQueryRequest.getUserName();
        String userProfile = userQueryRequest.getUserProfile();
        String userRole = userQueryRequest.getUserRole();
        String sortField = userQueryRequest.getSortField();
        String sortOrder = userQueryRequest.getSortOrder();
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(id != null, "id", id);
        queryWrapper.eq(StringUtils.isNotBlank(unionId), "unionId", unionId);
        queryWrapper.eq(StringUtils.isNotBlank(mpOpenId), "mpOpenId", mpOpenId);
        queryWrapper.eq(StringUtils.isNotBlank(userRole), "userRole", userRole);
        queryWrapper.like(StringUtils.isNotBlank(userProfile), "userProfile", userProfile);
        queryWrapper.like(StringUtils.isNotBlank(userName), "userName", userName);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    /**
     * 添加用户签到记录
     * @param userId 用户 id
     * @return 当前用户是否已签到成功
     */
    @Override
    public boolean addUserSignIn(long userId) {
        LocalDate date = LocalDate.now();
        String key = RedisConstant.getUserSignInRedisKey(date.getYear(), userId);
        // 获取 Redis 的 BitMap
        RBitSet signInBitSet = redissonClient.getBitSet(key);
        // 获取当前日期是一年中的第几天，作为偏移量（从 1 开始计数）
        int offset = date.getDayOfYear();
        // 查询当天有没有签到
        if (!signInBitSet.get(offset)) {
            // 如果当前未签到，则设置
            signInBitSet.set(offset, true);
        }
        // 当天已签到
        return true;
    }

    /**
     * 获取用户某个年份的签到记录
     *
     * @param userId 用户 id
     * @param year   年份（为空表示当前年份）
     * @return 签到记录映射
     */
    @Override
    public List<Integer> getUserSignInRecord(long userId, Integer year) {
        if (year == null) {
            LocalDate date = LocalDate.now();
            year = date.getYear();
        }
        String key = RedisConstant.getUserSignInRedisKey(year, userId);
        // 获取 Redis 的 BitMap
        RBitSet signInBitSet = redissonClient.getBitSet(key);
        // 加载 BitSet 到内存中，避免后续读取时发送多次请求
        BitSet bitSet = signInBitSet.asBitSet();
        // 统计签到的日期
        List<Integer> dayList = new ArrayList<>();
        // 从索引 0 开始查找下一个被设置为 1 的位
        int index = bitSet.nextSetBit(0);
        while (index >= 0) {
            dayList.add(index);
            // 继续查找下一个被设置为 1 的位
            index = bitSet.nextSetBit(index + 1);
        }
        return dayList;
    }

    /**
     * 获取签到排行榜
     *
     * @param limit 排行榜数量
     * @param year 年份（为空表示所有年份）
     * @param month 月份（为空表示整年）
     * @return 用户签到排行榜
     */
    @Override
    public List<UserVO> getUserSignInRank(Integer limit, Integer year, Integer month) {
        if (limit == null) {
            limit = 10;
        }
        String rankKey;
        if (year == null) {
            // 总排行榜
            rankKey = RedisConstant.getUserSignInTotalRankKey();
        } else if (month == null) {
            // 年度排行榜
            rankKey = RedisConstant.getUserSignInRankKey(year);
        } else {
            // 月度排行榜
            rankKey = RedisConstant.getUserSignInMonthlyRankKey(year, month);
        }
        String userKey = RedisConstant.getUserRankCacheKey();
        
        // 1. 先从Redis获取排行榜
        Set<Object> rankSet = redisTemplate.opsForZSet().reverseRange(rankKey, 0, limit - 1);

        if (rankSet != null && !rankSet.isEmpty()) {
            // Redis中存在数据，直接返回
            return rankSet.stream()
                    .map(id -> {
                        // 先从Redis获取用户信息
                        UserVO userVO = (UserVO) redisTemplate.opsForHash().get(userKey, String.valueOf(id));
                        if (userVO == null) {
                            // Redis中没有，从数据库获取并缓存
                            User user = this.getById((Serializable) id);
                            userVO = getUserVO(user);
                            redisTemplate.opsForHash().put(userKey, String.valueOf(id), userVO);
                        }
                        // 设置签到数
                        Double score = redisTemplate.opsForZSet().score(rankKey, id);
                        userVO.setSignInCount(score != null ? score.intValue() : 0);
                        return userVO;
                    })
                    .collect(Collectors.toList());
        }
        
        // 2. Redis中没有数据，从数据库查询并写入Redis
        List<UserVO> rankList = this.baseMapper.selectList(new QueryWrapper<>())
                .stream()
                .map(user -> {
                    UserVO userVO = getUserVO(user);
                    int signInCount;
                    
                    if (year == null) {
                        // 统计所有年份的签到数
                        signInCount = getAllYearsSignInCount(user.getId());
                    } else if (month == null) {
                        // 统计指定年份的签到数
                        List<Integer> signInDays = getUserSignInRecord(user.getId(), year);
                        signInCount = signInDays.size();
                    } else {
                        // 统计指定月份的签到数
                        List<Integer> signInDays = getUserSignInRecord(user.getId(), year);
                        signInCount = (int) signInDays.stream()
                                .filter(day -> {
                                    LocalDate date = LocalDate.ofYearDay(year, day);
                                    return date.getMonthValue() == month;
                                })
                                .count();
                    }
                    
                    userVO.setSignInCount(signInCount);
                    // 写入排行榜数据
                    redisTemplate.opsForZSet().add(rankKey, user.getId(), signInCount);
                    // 写入用户信息缓存
                    redisTemplate.opsForHash().put(userKey, String.valueOf(user.getId()), userVO);
                    return userVO;
                })
                .sorted((a, b) -> b.getSignInCount() - a.getSignInCount())
                .limit(limit)
                .collect(Collectors.toList());
        
        return rankList;
    }

    /**
     * 获取用户所有年份的签到总数
     */
    private int getAllYearsSignInCount(Long userId) {
        int currentYear = LocalDate.now().getYear();
        int totalCount = 0;
        // 统计从2023年（或系统上线年份）到当前年份的所有签到数
        for (int year = 2023; year <= currentYear; year++) {
            List<Integer> signInDays = getUserSignInRecord(userId, year);
            totalCount += signInDays.size();
        }
        return totalCount;
    }
}






