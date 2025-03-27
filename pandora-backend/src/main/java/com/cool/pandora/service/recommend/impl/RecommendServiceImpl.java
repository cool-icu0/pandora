package com.cool.pandora.service.recommend.impl;


import com.alibaba.fastjson.JSONObject;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.mapper.recommend.QuestionRecommendMapper;
import com.cool.pandora.mapper.recommend.UserRecommendMapper;
import com.cool.pandora.model.dto.recommend.QuestionRecommendRequest;
import com.cool.pandora.model.dto.recommend.UserRecommendRequest;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.model.entity.question.QuestionCode;
import com.cool.pandora.model.entity.recommend.QuestionRecommend;
import com.cool.pandora.model.entity.recommend.UserRecommend;
import com.cool.pandora.model.vo.QuestionCodeVO;
import com.cool.pandora.model.vo.UserVO;
import com.cool.pandora.model.vo.recommend.QuestionRecommendVO;
import com.cool.pandora.model.vo.recommend.UserRecommendVO;
import com.cool.pandora.service.question.QuestionCodeService;
import com.cool.pandora.service.recommend.RecommendService;
import com.cool.pandora.service.recommend.algorithm.RecommendAlgorithm;
import com.cool.pandora.service.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendServiceImpl implements RecommendService {

    @Resource
    private UserRecommendMapper userRecommendMapper;

    @Resource
    private QuestionRecommendMapper questionRecommendMapper;

    @Resource
    private RecommendAlgorithm recommendAlgorithm;
    @Resource
    private UserService userService;
    @Resource
    private QuestionCodeService questionCodeService;

    @Override
    public List<UserRecommendVO> getUserRecommendList(UserRecommendRequest request) {
        Long userId = request.getUserId();
        // 1. 基于用户标签的协同过滤
        List<User> similarUsers = recommendAlgorithm.findSimilarUsers(userId);

        // 2. 计算推荐分数
        List<UserRecommend> recommendations = recommendAlgorithm.calculateUserScores(userId, similarUsers);

        // 3. 过滤并排序
        return recommendations.stream()
                .filter(rec -> rec.getStatus() == 1) // 只返回待处理的推荐
                .sorted(Comparator.comparing(UserRecommend::getScore).reversed())
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionRecommendVO> getQuestionRecommendList(QuestionRecommendRequest request) {
        Long userId = request.getUserId();
        String type = request.getType();

        List<QuestionRecommend> recommendations;
        switch (type) {
            case "similar":
                recommendations = recommendAlgorithm.getSimilarQuestions(userId);
                break;
            case "daily":
                recommendations = recommendAlgorithm.getDailyRecommendations(userId);
                break;
            case "level":
                recommendations = recommendAlgorithm.getLevelProgressions(userId);
                break;
            default:
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        return recommendations.stream()
                .sorted(Comparator.comparing(QuestionRecommend::getScore).reversed())
                .map(this::convertToVO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean updateUserRecommendStatus(Long userId, Long recommendUserId, Integer status) {
        return false;
    }

    @Override
    public boolean updateQuestionRecommendStatus(Long userId, Long questionId, Integer status) {
        return false;
    }

    // 解析用户
    private UserRecommendVO convertToVO(UserRecommend userRecommend) {
        UserRecommendVO vo = new UserRecommendVO();
        BeanUtils.copyProperties(userRecommend, vo);

        // 解析标签
        if (userRecommend.getTags() != null) {
            vo.setTags(JSONObject.parseArray(userRecommend.getTags(), String.class));
        }
        User user = userService.getById(userRecommend.getRecommendUserId());
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        vo.setRecommendUser(userVO);

        return vo;
    }

    //解析题目
    private QuestionRecommendVO convertToVO(QuestionRecommend questionRecommend) {
        QuestionRecommendVO vo = new QuestionRecommendVO();
        BeanUtils.copyProperties(questionRecommend, vo);

        QuestionCode questionCode = questionCodeService.getById(questionRecommend.getQuestionId());
        QuestionCodeVO questionCodeVO = new QuestionCodeVO();
        BeanUtils.copyProperties(questionCode, questionCodeVO);
        vo.setQuestionCodeVO(questionCodeVO);
        return vo;
    }

}