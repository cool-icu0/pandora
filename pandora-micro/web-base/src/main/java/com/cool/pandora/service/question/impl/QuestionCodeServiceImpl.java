package com.cool.pandora.service.question.impl;

import com.alibaba.nacos.common.utils.CollectionUtils;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.common.common.ErrorCode;
import com.cool.common.constant.CommonConstant;
import com.cool.common.constant.RedisConstant;
import com.cool.common.exception.BusinessException;
import com.cool.common.exception.ThrowUtils;
import com.cool.model.vo.QuestionCodeVO;
import com.cool.model.vo.UserVO;
import com.cool.pandora.mapper.question.QuestionCodeMapper;
import com.cool.pandora.mapper.question.QuestionSubmitMapper;
import com.cool.model.dto.questionCode.QuestionQueryRequest;
import com.cool.model.dto.questionSubmit.JudgeInfo;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.User;
import com.cool.model.entity.question.QuestionSubmit;
import com.cool.model.enums.QuestionSubmitStatusEnum;
import com.cool.pandora.service.question.QuestionCodeService;
import com.cool.pandora.service.user.UserService;
import com.cool.common.utils.SqlUtils;
import com.google.gson.Gson;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @Author Cool
 * @Date 2025/3/6 上午10:27
 */
@Service
public class QuestionCodeServiceImpl extends ServiceImpl<QuestionCodeMapper, QuestionCode>
        implements QuestionCodeService {
    private final static Gson GSON = new Gson();

    @Resource
    private UserService userService;
    @Resource
    private RedisTemplate redisTemplate;
    @Resource
    private QuestionSubmitMapper questionSubmitMapper;


    /**
     * 校验题目是否合法
     *
     * @param questionCode
     * @param add
     */
    @Override
    public void validQuestionCode(QuestionCode questionCode, boolean add) {
        if (questionCode == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long userId = questionCode.getUserId();
        String title = questionCode.getTitle();
        String content = questionCode.getContent();
        String tags = questionCode.getTags();
        String answer = questionCode.getAnswer();
        String judgeCase = questionCode.getJudgeCase();
        String judgeConfig = questionCode.getJudgeConfig();

        // 创建时，参数不能为空
        if (add) {
            ThrowUtils.throwIf(StringUtils.isAnyBlank(title, content, tags), ErrorCode.PARAMS_ERROR);
        }
        // 有参数则校验
        if (StringUtils.isNotBlank(title) && title.length() > 80) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标题过长");
        }
        if (StringUtils.isNotBlank(content) && content.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "内容过长");
        }
        if (StringUtils.isNotBlank(answer) && answer.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "答案过长");
        }
        if (StringUtils.isNotBlank(judgeCase) && judgeCase.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "判题用例过长");
        }
        if (StringUtils.isNotBlank(judgeConfig) && judgeConfig.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "判题配置过长");
        }
    }

    /**
     * 获取查询包装类 (用户根据哪些字段查询，根据前端传来的请求对象，得到 mybatis 框架支持的查询类)
     *
     * @param questionQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<QuestionCode> getQueryWrapper(QuestionQueryRequest questionQueryRequest) {
        QueryWrapper<QuestionCode> queryWrapper = new QueryWrapper<>();
        if (questionQueryRequest == null) {
            return queryWrapper;
        }
        Long id = questionQueryRequest.getId();
        Long userId = questionQueryRequest.getUserId();
        String title = questionQueryRequest.getTitle();
        String content = questionQueryRequest.getContent();
        List<String> tags = questionQueryRequest.getTags();
        String answer = questionQueryRequest.getAnswer();
        String sortField = questionQueryRequest.getSortField();
        String sortOrder = questionQueryRequest.getSortOrder();
        String diffculty = questionQueryRequest.getDifficulty();


        // 拼接查询条件
        queryWrapper.like(StringUtils.isNotBlank(title), "title", title);
        queryWrapper.like(StringUtils.isNotBlank(content), "content", content);
        queryWrapper.like(StringUtils.isNotBlank(answer), "answer", answer);
        if (CollectionUtils.isNotEmpty(tags)) {
            for (String tag : tags) {
                queryWrapper.like("tags", "\"" + tag + "\"");
            }
        }
        queryWrapper.eq(ObjectUtils.isNotEmpty(id), "id", id);
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.eq("isDelete", false);
        queryWrapper.eq(StringUtils.isNotBlank(diffculty), "difficulty", diffculty);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    @Override
    public QuestionCodeVO getQuestionCodeVO(QuestionCode questionCode, HttpServletRequest request) {
        QuestionCodeVO questionCodeVO = QuestionCodeVO.objToVo(questionCode);
        // 1. 关联查询用户信息
        Long userId = questionCode.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userService.getById(userId);
        }
        UserVO userVO = userService.getUserVO(user);
        questionCodeVO.setUserVO(userVO);
        return questionCodeVO;
    }

    @Override
    public Page<QuestionCodeVO> getQuestionCodeVOPage(Page<QuestionCode> questionCodePage, HttpServletRequest request) {
        List<QuestionCode> questionCodeList = questionCodePage.getRecords();
        Page<QuestionCodeVO> questionCodeVOPage = new Page<>(questionCodePage.getCurrent(), questionCodePage.getSize(), questionCodePage.getTotal());
        if (CollectionUtils.isEmpty(questionCodeList)) {
            return questionCodeVOPage;
        }
        // 1. 关联查询用户信息
        Set<Long> userIdSet = questionCodeList.stream().map(QuestionCode::getUserId).collect(Collectors.toSet());
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));
        // 填充信息
        List<QuestionCodeVO> questionVOList = questionCodeList.stream().map(questionCode -> {
            QuestionCodeVO questionCodeVO = QuestionCodeVO.objToVo(questionCode);
            Long userId = questionCode.getUserId();
            User user = null;
            if (userIdUserListMap.containsKey(userId)) {
                user = userIdUserListMap.get(userId).get(0);
            }
            questionCodeVO.setUserVO(userService.getUserVO(user));
            return questionCodeVO;
        }).collect(Collectors.toList());
        questionCodeVOPage.setRecords(questionVOList);
        return questionCodeVOPage;
    }

    /**
     * 获取通过题目排行榜
     * @param limit 返回数量
     * @param year 年份（为空表示所有年份）
     * @param month 月份（为空表示整年）
     * @return 通过题目信息列表
     */
    @Override
    public List<UserVO> getQuestionCodeRank(Integer limit, Integer year, Integer month) {
        if (limit == null) {
            limit = 10;
        }
        
        String rankKey;
        if (year == null) {
            rankKey = RedisConstant.getQuestionCodeTotalRankKey();
        } else if (month == null) {
            rankKey = RedisConstant.getQuestionCodeRankKey(year);
        } else {
            rankKey = RedisConstant.getQuestionCodeMonthlyRankKey(year, month);
        }
        String userKey = RedisConstant.getUserRankCacheKey();
        
        // 1. 先从Redis获取排行榜
        Set<Object> rankSet = redisTemplate.opsForZSet().reverseRange(rankKey, 0, limit - 1);

        if (rankSet != null && !rankSet.isEmpty()) {
            return rankSet.stream()
                    .map(id -> {
                        UserVO userVO = (UserVO) redisTemplate.opsForHash().get(userKey, String.valueOf(id));
                        if (userVO == null) {
                            User user = userService.getById((Serializable) id);
                            userVO = userService.getUserVO(user);
                            redisTemplate.opsForHash().put(userKey, String.valueOf(id), userVO);
                        }
                        Double score = redisTemplate.opsForZSet().score(rankKey, id);
                        userVO.setQuestionPassCount(score != null ? score.intValue() : 0);
                        return userVO;
                    })
                    .collect(Collectors.toList());
        }
        
        // 2. Redis中没有数据，从数据库查询并写入Redis
        List<UserVO> rankList = userService.list(new QueryWrapper<User>())
                .stream()
                .map(user -> {
                    UserVO userVO = userService.getUserVO(user);
                    int passCount;
                    
                    if (year == null) {
                        // 统计所有通过的题目数
                        passCount = getQuestionPassCount(user.getId(), null, null);
                    } else if (month == null) {
                        // 统计年度通过的题目数
                        passCount = getQuestionPassCount(user.getId(), year, null);
                    } else {
                        // 统计月度通过的题目数
                        passCount = getQuestionPassCount(user.getId(), year, month);
                    }
                    
                    userVO.setQuestionPassCount(passCount);
                    redisTemplate.opsForZSet().add(rankKey, user.getId(), passCount);
                    redisTemplate.opsForHash().put(userKey, String.valueOf(user.getId()), userVO);
                    return userVO;
                })
                .sorted((a, b) -> b.getQuestionPassCount() - a.getQuestionPassCount())
                .limit(limit)
                .collect(Collectors.toList());
        
        return rankList;
    }

    /**
     * 获取用户通过的题目数量
     * @param userId 用户id
     * @param year 年份（为空表示所有年份）
     * @param month 月份（为空表示整年）
     * @return 通过的题目数量
     */
    private int getQuestionPassCount(Long userId, Integer year, Integer month) {
        // 1. 先查询该用户的所有提交记录
        QueryWrapper<QuestionSubmit> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("userId", userId);
        
        if (year != null) {
            // 添加年份条件
            if (month != null) {
                // 查询指定月份
                LocalDate startDate = LocalDate.of(year, month, 1);
                LocalDate endDate = startDate.plusMonths(1).minusDays(1);
                queryWrapper.between("createTime", startDate, endDate);
            } else {
                // 查询整年
                LocalDate startDate = LocalDate.of(year, 1, 1);
                LocalDate endDate = startDate.plusYears(1).minusDays(1);
                queryWrapper.between("createTime", startDate, endDate);
            }
        }
        
        // 2. 获取提交记录并过滤
        return (int) questionSubmitMapper.selectList(queryWrapper)
                .stream()
                .filter(submit -> {
                    String judgeInfo = submit.getJudgeInfo();
                    // 解析 judgeInfo 判断是否通过
                    JudgeInfo info = GSON.fromJson(judgeInfo, JudgeInfo.class);
                    return info != null && QuestionSubmitStatusEnum.SUCCEED.getText().equals(info.getMessage());
                })
                // 按题目 ID 去重
                .map(QuestionSubmit::getQuestionId)
                .distinct()
                .count();
    }
}
