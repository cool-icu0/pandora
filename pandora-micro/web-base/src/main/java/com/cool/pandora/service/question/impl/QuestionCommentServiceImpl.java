package com.cool.pandora.service.question.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.common.common.ErrorCode;
import com.cool.common.exception.BusinessException;
import com.cool.common.exception.ThrowUtils;
import com.cool.pandora.mapper.question.QuestionCommentMapper;
import com.cool.model.dto.questionComment.QuestionCommentQueryRequest;
import com.cool.model.entity.question.QuestionComment;
import com.cool.model.entity.User;
import com.cool.pandora.service.question.QuestionCommentService;
import com.cool.server.UserFeignClient;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * 题目评论服务实现
 */
@Service
public class QuestionCommentServiceImpl extends ServiceImpl<QuestionCommentMapper, QuestionComment>
        implements QuestionCommentService {

    @Resource
    private UserFeignClient userFeignClient;

    @Override
    public void validQuestionComment(QuestionComment questionComment, boolean add) {
        if (questionComment == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String content = questionComment.getContent();
        // 创建时，参数不能为空
        if (add) {
            ThrowUtils.throwIf(StringUtils.isAnyBlank(content), ErrorCode.PARAMS_ERROR);
        }
        // 有参数则校验
        if (StringUtils.isNotBlank(content) && content.length() > 8192) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评论内容过长");
        }
    }

    @Override
    public long addComment(QuestionComment questionComment, User loginUser) {
        validQuestionComment(questionComment, true);
        questionComment.setUserId(loginUser.getId());
        boolean result = this.save(questionComment);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return questionComment.getId();
    }

    @Override
    public boolean deleteComment(long id, User loginUser) {
        // 判断是否存在
        QuestionComment oldQuestionComment = this.getById(id);
        ThrowUtils.throwIf(oldQuestionComment == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可删除
        if (!oldQuestionComment.getUserId().equals(loginUser.getId()) && !userFeignClient.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        return this.removeById(id);
    }

    @Override
    public boolean updateComment(QuestionComment questionComment, User loginUser) {
        // 判断是否存在
        QuestionComment oldQuestionComment = this.getById(questionComment.getId());
        ThrowUtils.throwIf(oldQuestionComment == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可修改
        if (!oldQuestionComment.getUserId().equals(loginUser.getId()) && !userFeignClient.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        validQuestionComment(questionComment, false);
        return this.updateById(questionComment);
    }

    @Override
    public Page<QuestionComment> getCommentPage(QuestionCommentQueryRequest questionCommentQueryRequest) {
        long current = questionCommentQueryRequest.getCurrent();
        long size = questionCommentQueryRequest.getPageSize();
        QueryWrapper<QuestionComment> queryWrapper = new QueryWrapper<>();
        // 添加题目ID查询条件
        queryWrapper.eq("questionId", questionCommentQueryRequest.getQuestionId());
        // 按创建时间降序排序，保证最新评论在前
        queryWrapper.orderByDesc("createTime");
        return this.page(new Page<>(current, size), queryWrapper);
    }
}