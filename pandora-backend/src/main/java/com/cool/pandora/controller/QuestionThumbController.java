package com.cool.pandora.controller;

import com.cool.pandora.common.BaseResponse;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.common.ResultUtils;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.model.dto.questionThumb.QuestionThumbAddRequest;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionThumbService;
import com.cool.pandora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 题目点赞接口
 */
@RestController
@RequestMapping("/question_thumb")
@Slf4j
public class QuestionThumbController {

    @Resource
    private QuestionThumbService questionThumbService;

    @Resource
    private UserService userService;

    /**
     * 点赞 / 取消点赞
     *
     * @param questionThumbAddRequest
     * @param request
     * @return resultNum 本次点赞变化数
     */
    @PostMapping("/")
    public BaseResponse<Integer> doThumb(@RequestBody QuestionThumbAddRequest questionThumbAddRequest,
            HttpServletRequest request) {
        if (questionThumbAddRequest == null || questionThumbAddRequest.getQuestionId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 登录才能点赞
        final User loginUser = userService.getLoginUser(request);
        long questionId = questionThumbAddRequest.getQuestionId();
        int result = questionThumbService.doQuestionThumb(questionId, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 获取题目点赞数
     *
     * @param questionId 题目id
     * @return 题目点赞数
     */
    @GetMapping("/get/count")
    public BaseResponse<Integer> getThumbCount(@RequestParam("questionId") long questionId) {
        if (questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        int count = questionThumbService.getQuestionThumbCount(questionId);
        return ResultUtils.success(count);
    }

    /**
     * 判断用户是否点赞题目
     *
     * @param questionId 题目id
     * @param request
     * @return 是否点赞
     */
    @GetMapping("/get/check")
    public BaseResponse<Boolean> checkThumb(@RequestParam("questionId") long questionId,
            HttpServletRequest request) {
        if (questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 获取登录用户
        final User loginUser = userService.getLoginUser(request);
        // 判断是否已收藏
        boolean isFavourite = questionThumbService.isQuestionThumb(questionId, loginUser.getId());
        return ResultUtils.success(isFavourite);
    }
}