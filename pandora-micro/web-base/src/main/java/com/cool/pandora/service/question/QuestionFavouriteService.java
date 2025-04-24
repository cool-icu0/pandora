package com.cool.pandora.service.question;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.model.dto.questionFavourite.QuestionFavouriteQueryRequest;
import com.cool.model.entity.question.Question;
import com.cool.model.entity.question.QuestionFavourite;
import com.cool.model.entity.User;

import java.util.List;

/**
 * 题目收藏服务
 */
public interface QuestionFavouriteService extends IService<QuestionFavourite> {
    
    /**
     * 收藏 / 取消收藏
     * @param questionId
     * @param loginUser
     * @return
     */
    int doQuestionFavourite(long questionId, User loginUser);

    /**
     * 获取用户收藏的题目列表
     * @param loginUser
     * @return
     */
    List<Question> listMyFavouriteQuestions(User loginUser);
    
    /**
     * 判断用户是否已收藏题目
     * 
     * @param questionId 题目id
     * @param userId 用户id
     * @return 是否已收藏
     */
    boolean isQuestionFavourite(long questionId, long userId);

    /**
     * 获取题目收藏数
     *
     * @param questionId 题目id
     * @return 收藏数
     */
    int getFavourite(long questionId);


    /**
     * 分页获取用户收藏的题目
     *
     * @param questionFavouriteQueryRequest 查询请求
     * @param loginUser 登录用户
     * @return 收藏题目分页数据
     */
    Page<Question> listMyFavouriteQuestionsByPage(QuestionFavouriteQueryRequest questionFavouriteQueryRequest, User loginUser);
}