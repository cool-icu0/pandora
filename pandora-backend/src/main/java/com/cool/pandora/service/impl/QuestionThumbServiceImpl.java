package com.cool.pandora.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.mapper.QuestionThumbMapper;
import com.cool.pandora.model.entity.Question;
import com.cool.pandora.model.entity.QuestionThumb;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionService;
import com.cool.pandora.service.QuestionThumbService;
import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

/**
 * 题目点赞服务实现
 */
@Service
public class QuestionThumbServiceImpl extends ServiceImpl<QuestionThumbMapper, QuestionThumb>
        implements QuestionThumbService {

    @Resource
    private QuestionService questionService;
    
    @Resource
    private QuestionThumbMapper questionThumbMapper;

    /**
     * 点赞
     *
     * @param questionId 题目 id
     * @param loginUser 登录用户
     * @return 本次点赞变化数
     */
    @Override
    public int doQuestionThumb(long questionId, User loginUser) {
        // 判断实体是否存在，根据类别获取实体
        Question question = questionService.getById(questionId);
        if (question == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已点赞
        long userId = loginUser.getId();
        // 每个用户串行点赞
        // 锁必须要包裹住事务方法
        QuestionThumbService questionThumbService = (QuestionThumbService) AopContext.currentProxy();
        synchronized (String.valueOf(userId).intern()) {
            return questionThumbService.doQuestionThumbInner(userId, questionId);
        }
    }

    /**
     * 封装了事务的方法
     *
     * @param userId 用户 id
     * @param questionId 题目 id
     * @return 本次点赞变化数
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int doQuestionThumbInner(long userId, long questionId) {
        QuestionThumb questionThumb = new QuestionThumb();
        questionThumb.setUserId(userId);
        questionThumb.setQuestionId(questionId);
        QueryWrapper<QuestionThumb> thumbQueryWrapper = new QueryWrapper<>(questionThumb);
        QuestionThumb oldQuestionThumb = this.getOne(thumbQueryWrapper);
        boolean result;
        // 已点赞
        if (oldQuestionThumb != null) {
            result = this.remove(thumbQueryWrapper);
            if (result) {
                return -1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR);
            }
        } else {
            result = this.save(questionThumb);
            if (result) {
                return 1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR);
            }
        }
    }
    @Override
    public int getQuestionThumbCount(long questionId) {
        // 查询条件：题目id和点赞状态为1（已点赞）
        QueryWrapper<QuestionThumb> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("questionId", questionId);
        queryWrapper.eq("thumbStatus", 1);
        return Math.toIntExact(questionThumbMapper.selectCount(queryWrapper));
    }
}