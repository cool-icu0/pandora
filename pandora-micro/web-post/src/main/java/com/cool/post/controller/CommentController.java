package com.cool.post.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.common.annotation.AuthCheck;
import com.cool.common.common.BaseResponse;
import com.cool.common.common.DeleteRequest;
import com.cool.common.common.ErrorCode;
import com.cool.common.common.ResultUtils;
import com.cool.common.exception.BusinessException;
import com.cool.model.dto.postComment.CommentAddRequest;
import com.cool.model.dto.postComment.CommentQueryRequest;
import com.cool.model.dto.postComment.CommentThumbAddRequest;
import com.cool.model.dto.postComment.CommentUpdateRequest;
import com.cool.model.entity.User;
import com.cool.model.vo.CommentVO;
import com.cool.pandora.service.post.CommentThumbService;
import com.cool.pandora.service.post.PostCommentService;
import com.cool.pandora.service.user.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 评论接口
 */
@RestController
@RequestMapping("/comment")
@Slf4j
public class CommentController {

    @Resource
    private PostCommentService postCommentService;

    @Resource
    private CommentThumbService commentThumbService;

    @Resource
    private UserService userService;

    /**
     * 创建评论
     *
     * @param commentAddRequest 创建评论请求
     * @param request HTTP请求
     * @return 评论ID
     */
    @PostMapping("/add")
    public BaseResponse<Long> addComment(@RequestBody CommentAddRequest commentAddRequest, HttpServletRequest request) {
        if (commentAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUser(request);
        Long commentId = postCommentService.addComment(commentAddRequest, loginUser);
        return ResultUtils.success(commentId);
    }

    /**
     * 删除评论
     *
     * @param deleteRequest 删除请求
     * @param request HTTP请求
     * @return 是否成功
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteComment(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        boolean result = postCommentService.deleteComment(id, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 更新评论
     *
     * @param commentUpdateRequest 更新评论请求
     * @param request HTTP请求
     * @return 是否成功
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateComment(@RequestBody CommentUpdateRequest commentUpdateRequest, HttpServletRequest request) {
        if (commentUpdateRequest == null || commentUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUser(request);
        boolean result = postCommentService.updateComment(commentUpdateRequest, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取评论
     *
     * @param id 评论ID
     * @param request HTTP请求
     * @return 评论VO
     */
    @GetMapping("/get")
    public BaseResponse<CommentVO> getCommentById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUserPermitNull(request);
        CommentVO commentVO = postCommentService.getCommentVO(postCommentService.getById(id), loginUser);
        return ResultUtils.success(commentVO);
    }

    /**
     * 分页获取评论列表
     *
     * @param commentQueryRequest 查询条件
     * @param request HTTP请求
     * @return 评论VO分页
     */
    @PostMapping("/list/page")
    public BaseResponse<Page<CommentVO>> listCommentByPage(@RequestBody CommentQueryRequest commentQueryRequest, HttpServletRequest request) {
        if (commentQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUserPermitNull(request);
        Page<CommentVO> commentVOPage = postCommentService.listCommentVOByPage(commentQueryRequest, loginUser);
        return ResultUtils.success(commentVOPage);
    }

    /**
     * 评论点赞
     *
     * @param commentThumbAddRequest 评论点赞请求
     * @param request HTTP请求
     * @return 点赞结果
     */
    @PostMapping("/thumb")
    public BaseResponse<Integer> thumbComment(@RequestBody CommentThumbAddRequest commentThumbAddRequest, HttpServletRequest request) {
        if (commentThumbAddRequest == null || commentThumbAddRequest.getCommentId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        User loginUser = userService.getLoginUser(request);
        int result = commentThumbService.doThumb(commentThumbAddRequest.getCommentId(), loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 管理员删除评论
     *
     * @param deleteRequest 删除请求
     * @return 是否成功
     */
    @PostMapping("/delete/admin")
    @ApiOperation(value = "管理员删除评论")
    @AuthCheck(mustRole = "admin")
    public BaseResponse<Boolean> deleteCommentAdmin(@RequestBody DeleteRequest deleteRequest) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        boolean result = postCommentService.removeById(deleteRequest.getId());
        return ResultUtils.success(result);
    }

    /**
     * 获取我的评论列表
     *
     * @param commentQueryRequest 查询条件
     * @param request HTTP请求
     * @return 评论VO分页
     */
    @PostMapping("/my/list/page")
    @ApiOperation(value = "获取我的评论列表")
    public BaseResponse<Page<CommentVO>> listMyCommentByPage(@RequestBody CommentQueryRequest commentQueryRequest, HttpServletRequest request) {
        if (commentQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        User loginUser = userService.getLoginUser(request);
        commentQueryRequest.setUserId(loginUser.getId());
        Page<CommentVO> commentVOPage = postCommentService.listCommentVOByPage(commentQueryRequest, loginUser);
        return ResultUtils.success(commentVOPage);
    }
}