package com.cool.pandora.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.pandora.common.BaseResponse;
import com.cool.pandora.common.DeleteRequest;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.common.ResultUtils;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.exception.ThrowUtils;
import com.cool.pandora.model.dto.questionComment.QuestionCommentAddRequest;
import com.cool.pandora.model.dto.questionComment.QuestionCommentQueryRequest;
import com.cool.pandora.model.dto.questionComment.QuestionCommentUpdateRequest;
import com.cool.pandora.model.entity.QuestionComment;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionCommentService;
import com.cool.pandora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 题目评论接口
 */
@RestController
@RequestMapping("/question_comment")
@Slf4j
public class QuestionCommentController {

    @Resource
    private QuestionCommentService questionCommentService;

    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addQuestionComment(@RequestBody QuestionCommentAddRequest questionCommentAddRequest,
            HttpServletRequest request) {
        if (questionCommentAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionComment questionComment = new QuestionComment();
        BeanUtils.copyProperties(questionCommentAddRequest, questionComment);
        User loginUser = userService.getLoginUser(request);
        long result = questionCommentService.addComment(questionComment, loginUser);
        return ResultUtils.success(result);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteQuestionComment(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        boolean result = questionCommentService.deleteComment(deleteRequest.getId(), loginUser);
        return ResultUtils.success(result);
    }

    @PostMapping("/update")
    public BaseResponse<Boolean> updateQuestionComment(@RequestBody QuestionCommentUpdateRequest questionCommentUpdateRequest,
            HttpServletRequest request) {
        if (questionCommentUpdateRequest == null || questionCommentUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionComment questionComment = new QuestionComment();
        BeanUtils.copyProperties(questionCommentUpdateRequest, questionComment);
        User loginUser = userService.getLoginUser(request);
        boolean result = questionCommentService.updateComment(questionComment, loginUser);
        return ResultUtils.success(result);
    }

    @GetMapping("/get")
    public BaseResponse<QuestionComment> getQuestionCommentById(long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionComment questionComment = questionCommentService.getById(id);
        ThrowUtils.throwIf(questionComment == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(questionComment);
    }

    @PostMapping("/list/page")
    public BaseResponse<Page<QuestionComment>> listQuestionCommentByPage(@RequestBody QuestionCommentQueryRequest questionCommentQueryRequest) {
        if (questionCommentQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Page<QuestionComment> questionCommentPage = questionCommentService.getCommentPage(questionCommentQueryRequest);
        return ResultUtils.success(questionCommentPage);
    }
}