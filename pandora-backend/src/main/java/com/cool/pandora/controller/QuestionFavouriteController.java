package com.cool.pandora.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.pandora.common.BaseResponse;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.common.ResultUtils;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.exception.ThrowUtils;
import com.cool.pandora.model.dto.questionFavourite.QuestionFavouriteAddRequest;
import com.cool.pandora.model.dto.questionFavourite.QuestionFavouriteQueryRequest;
import com.cool.pandora.model.entity.Question;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.service.QuestionFavouriteService;
import com.cool.pandora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 题目收藏接口
 */
@RestController
@RequestMapping("/question_favourite")
@Slf4j
public class QuestionFavouriteController {

    @Resource
    private QuestionFavouriteService questionFavouriteService;

    @Resource
    private UserService userService;

    /**
     * 获取用户收藏的题目列表
     *
     * @param request
     * @return 收藏题目列表
     */
    @GetMapping("/my/list")
    public BaseResponse<List<Question>> listMyFavouriteQuestions(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        final User loginUser = userService.getLoginUser(request);
        List<Question> questionList = questionFavouriteService.listMyFavouriteQuestions(loginUser);
        return ResultUtils.success(questionList);
    }

    /**
     * 收藏 / 取消收藏
     *
     * @param questionFavouriteAddRequest
     * @param request
     * @return resultNum 本次收藏变化数
     */
    @PostMapping("/")
    public BaseResponse<Integer> doFavourite(@RequestBody QuestionFavouriteAddRequest questionFavouriteAddRequest,
            HttpServletRequest request) {
        if (questionFavouriteAddRequest == null || questionFavouriteAddRequest.getQuestionId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 登录才能收藏
        final User loginUser = userService.getLoginUser(request);
        long questionId = questionFavouriteAddRequest.getQuestionId();
        int result = questionFavouriteService.doQuestionFavourite(questionId, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 判断当前用户是否已收藏题目
     *
     * @param questionId 题目id
     * @param request HTTP请求
     * @return 是否已收藏
     */
    @GetMapping("/check")
    public BaseResponse<Boolean> checkFavourite(@RequestParam("questionId") long questionId, 
                                               HttpServletRequest request) {
        if (questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 获取登录用户
        final User loginUser = userService.getLoginUser(request);
        // 判断是否已收藏
        boolean isFavourite = questionFavouriteService.isQuestionFavourite(questionId, loginUser.getId());
        return ResultUtils.success(isFavourite);
    }

    /**
     * 获取题目收藏数
     *
     * @param questionId 题目id
     * @return 收藏数
     */
    @GetMapping("/count")
    public BaseResponse<Integer> getFavourite(@RequestParam("questionId") long questionId) {
        if (questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 判断是否已收藏
        int isFavourite = questionFavouriteService.getFavourite(questionId);
        return ResultUtils.success(isFavourite);
    }

    /**
     * 分页获取用户收藏的题目
     *
     * @param questionFavouriteQueryRequest 查询请求
     * @param request HTTP请求
     * @return 收藏题目分页数据
     */
    @PostMapping("/my/list/page")
    public BaseResponse<Page<Question>> listMyFavouriteQuestionsByPage(@RequestBody QuestionFavouriteQueryRequest questionFavouriteQueryRequest,
                                                                       HttpServletRequest request) {
        if (questionFavouriteQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        long current = questionFavouriteQueryRequest.getCurrent();
        long size = questionFavouriteQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        Page<Question> questionPage = questionFavouriteService.listMyFavouriteQuestionsByPage(questionFavouriteQueryRequest, loginUser);
        return ResultUtils.success(questionPage);
    }
}