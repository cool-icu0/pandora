package com.cool.pandora.service.question;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.model.entity.question.QuestionThumb;
import com.cool.model.entity.User;

/**
 * 题目点赞服务
 */
public interface QuestionThumbService extends IService<QuestionThumb> {

    /**
     * 点赞
     *
     * @param questionId 题目 id
     * @param loginUser 登录用户
     * @return 本次点赞变化数
     */
    int doQuestionThumb(long questionId, User loginUser);

    /**
     * 题目点赞（内部服务）
     *
     * @param userId 用户 id
     * @param questionId 题目 id
     * @return 本次点赞变化数
     */
    int doQuestionThumbInner(long userId, long questionId);
    
    /**
     * 获取题目点赞数
     *
     * @param questionId 题目id
     * @return 题目点赞数
     */
    int getQuestionThumbCount(long questionId);

    boolean isQuestionThumb(long questionId, Long id);
}