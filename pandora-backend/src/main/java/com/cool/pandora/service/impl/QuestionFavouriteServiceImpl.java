package com.cool.pandora.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.mapper.QuestionFavouriteMapper;
import com.cool.pandora.mapper.QuestionMapper;
import com.cool.pandora.model.dto.questionFavourite.QuestionFavouriteQueryRequest;
import com.cool.pandora.model.entity.Question;
import com.cool.pandora.model.entity.QuestionFavourite;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionFavouriteService;
import com.cool.pandora.service.QuestionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 题目收藏服务实现
 */
@Service
public class QuestionFavouriteServiceImpl extends ServiceImpl<QuestionFavouriteMapper,QuestionFavourite> implements QuestionFavouriteService {
    
    @Resource
    private QuestionFavouriteMapper questionFavouriteMapper;
    
    @Resource
    private QuestionMapper questionMapper;
    
    @Resource
    private QuestionService questionService;
    
    /**
     * 收藏
     *
     * @param questionId 题目 id
     * @param loginUser 登录用户
     * @return 本次收藏变化数
     */
    @Override
    public int doQuestionFavourite(long questionId, User loginUser) {
        // 判断实体是否存在，根据类别获取实体
        Question question = questionService.getById(questionId);
    
        if (question == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        //是否收藏
        long userId = loginUser.getId();
        // 已收藏
        QuestionFavouriteService questionFavouriteService = (QuestionFavouriteService) AopContext.currentProxy();
        boolean isFavourite = questionFavouriteService.isQuestionFavourite(questionId, userId);
        int result = 1;
        if (isFavourite) {
            // 已收藏，取消收藏
            QueryWrapper<QuestionFavourite> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("questionId", questionId);
            queryWrapper.eq("userId", userId);
            int delete = questionFavouriteMapper.delete(queryWrapper);
            result = -1;
            if (delete <= 0) {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "取消收藏失败");
            }
            return result;
        }
        // 未收藏，收藏
        QuestionFavourite questionFavourite = new QuestionFavourite();
        questionFavourite.setUserId(userId);
        questionFavourite.setQuestionId(questionId);
        boolean save = this.save(questionFavourite);
        if (!save) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "收藏失败");
        }
        return result;
    
    }
    @Override
    public List<Question> listMyFavouriteQuestions(User loginUser) {
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        // 先查询收藏记录
        LambdaQueryWrapper<QuestionFavourite> questionFavouriteQueryWrapper = new LambdaQueryWrapper<>();
        questionFavouriteQueryWrapper.eq(QuestionFavourite::getUserId, loginUser.getId());
        List<QuestionFavourite> questionFavouriteList = questionFavouriteMapper.selectList(questionFavouriteQueryWrapper);
        // 获取题目 id 列表
        List<Long> questionIdList = questionFavouriteList.stream()
                .map(QuestionFavourite::getQuestionId)
                .collect(Collectors.toList());
        if (CollectionUtils.isEmpty(questionIdList)) {
            return new ArrayList<>();
        }
        // 查询题目信息
        return questionMapper.selectBatchIds(questionIdList);
    }
    @Override
    public boolean isQuestionFavourite(long questionId, long userId) {
        // 查询条件：题目id和用户id
        QueryWrapper<QuestionFavourite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("questionId", questionId);
        queryWrapper.eq("userId", userId);
        // 查询是否存在记录
        long count = this.count(queryWrapper);
        return count > 0;
    }
    @Override
    public Page<Question> listMyFavouriteQuestionsByPage(QuestionFavouriteQueryRequest questionFavouriteQueryRequest, User loginUser) {
        long current = questionFavouriteQueryRequest.getCurrent();
        long size = questionFavouriteQueryRequest.getPageSize();
        String searchText = questionFavouriteQueryRequest.getSearchText();
        
        // 先查询收藏关系
        QueryWrapper<QuestionFavourite> favouriteQueryWrapper = new QueryWrapper<>();
        favouriteQueryWrapper.eq("userId", loginUser.getId());
        List<QuestionFavourite> questionFavouriteList = this.list(favouriteQueryWrapper);
        List<Long> questionIds = questionFavouriteList.stream()
                .map(QuestionFavourite::getQuestionId)
                .collect(Collectors.toList());
        if (questionIds.isEmpty()) {
            return new Page<>();
        }
        // 构建题目查询条件
        QueryWrapper<Question> questionQueryWrapper = new QueryWrapper<>();
        questionQueryWrapper.in("id", questionIds);
        // 支持标题搜索
        if (StringUtils.isNotBlank(searchText)) {
            questionQueryWrapper.like("title", searchText);
        }
        // 按收藏时间倒序
        questionQueryWrapper.orderByDesc("createTime");
        
        return questionService.page(new Page<>(current, size), questionQueryWrapper);
    }

    @Override
    public int getFavourite(long questionId) {
        // 查询条件：题目id和用户id
        QueryWrapper<QuestionFavourite> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("questionId", questionId);
        // 查询是否存在记录
        return (int) this.count(queryWrapper);
    }
}