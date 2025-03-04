package com.cool.pandora.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.mapper.QuestionFavouriteMapper;
import com.cool.pandora.mapper.QuestionMapper;
import com.cool.pandora.model.entity.Question;
import com.cool.pandora.model.entity.QuestionFavourite;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionFavouriteService;
import com.cool.pandora.service.QuestionService;
import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
        return 0;
    
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
}