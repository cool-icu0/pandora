package com.cool.pandora.controller;

import cn.dev33.satoken.annotation.SaCheckRole;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.common.common.BaseResponse;
import com.cool.common.common.DeleteRequest;
import com.cool.common.common.ErrorCode;
import com.cool.common.common.ResultUtils;
import com.cool.common.constant.UserConstant;
import com.cool.common.exception.BusinessException;
import com.cool.common.exception.ThrowUtils;
import com.cool.model.dto.mockinterview.MockInterviewAddRequest;
import com.cool.model.dto.mockinterview.MockInterviewEventRequest;
import com.cool.model.dto.mockinterview.MockInterviewQueryRequest;
import com.cool.model.entity.MockInterview;
import com.cool.model.entity.User;
import com.cool.pandora.service.interview.MockInterviewService;
import com.cool.pandora.service.user.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 模拟面试接口

 */
@RestController
@RequestMapping("/mockInterview")
@Slf4j
public class MockInterviewController {

    @Resource
    private MockInterviewService mockInterviewService;

    @Resource
    private UserService userService;

    // region 增删改查

    /**
     * 创建模拟面试
     *
     * @param mockInterviewAddRequest
     * @param request
     * @return
     */
    @PostMapping("/add")
    public BaseResponse<Long> addMockInterview(@RequestBody MockInterviewAddRequest mockInterviewAddRequest, HttpServletRequest request) {
        ThrowUtils.throwIf(mockInterviewAddRequest == null, ErrorCode.PARAMS_ERROR);
        // 获取当前登录用户
        User loginUser = userService.getLoginUser(request);
        // 调用 Service 创建模拟面试
        Long mockInterviewId = mockInterviewService.createMockInterview(mockInterviewAddRequest, loginUser);
        return ResultUtils.success(mockInterviewId);
    }

    /**
     * 删除模拟面试
     *
     * @param deleteRequest
     * @param request
     * @return
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteMockInterview(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        // 判断是否存在
        MockInterview oldMockInterview = mockInterviewService.getById(id);
        ThrowUtils.throwIf(oldMockInterview == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可删除
        if (!oldMockInterview.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        // 操作数据库
        boolean result = mockInterviewService.removeById(id);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(true);
    }

    /**
     * 根据 id 获取模拟面试（封装类）
     *
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get")
    public BaseResponse<MockInterview> getMockInterviewById(long id, HttpServletRequest request) {
        ThrowUtils.throwIf(id <= 0, ErrorCode.PARAMS_ERROR);
        // 查询数据库
        MockInterview mockInterview = mockInterviewService.getById(id);
        ThrowUtils.throwIf(mockInterview == null, ErrorCode.NOT_FOUND_ERROR);
        // 获取封装类
        return ResultUtils.success(mockInterview);
    }

    /**
     * 分页获取模拟面试列表（仅管理员可用）
     *
     * @param mockInterviewQueryRequest
     * @return
     */
    @PostMapping("/list/page")
    @SaCheckRole(UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<MockInterview>> listMockInterviewByPage(@RequestBody MockInterviewQueryRequest mockInterviewQueryRequest) {
        ThrowUtils.throwIf(mockInterviewQueryRequest == null, ErrorCode.PARAMS_ERROR);
        long current = mockInterviewQueryRequest.getCurrent();
        long pageSize = mockInterviewQueryRequest.getPageSize();
        // 查询数据库
        Page<MockInterview> queryPage = new Page<>(current, pageSize);
        Page<MockInterview> mockInterviewPage = mockInterviewService.page(
                queryPage,
                mockInterviewService.getQueryWrapper(mockInterviewQueryRequest)
        );
        return ResultUtils.success(mockInterviewPage);
    }

    /**
     * 分页获取当前登录用户创建的模拟面试列表
     *
     * @param mockInterviewQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/my/list/page/vo")
    public BaseResponse<Page<MockInterview>> listMockInterviewVOByPage(@RequestBody MockInterviewQueryRequest mockInterviewQueryRequest,
                                                                       HttpServletRequest request) {
        ThrowUtils.throwIf(mockInterviewQueryRequest == null, ErrorCode.PARAMS_ERROR);
        long size = mockInterviewQueryRequest.getPageSize();
        long current = mockInterviewQueryRequest.getCurrent();
        long pageSize = mockInterviewQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        // 限制只能获取本人的
        User loginUser = userService.getLoginUser(request);
        mockInterviewQueryRequest.setUserId(loginUser.getId());
        // 查询数据库
        Page<MockInterview> queryPage = new Page<>(current, pageSize);
        Page<MockInterview> mockInterviewPage = mockInterviewService.page(
                queryPage,
                mockInterviewService.getQueryWrapper(mockInterviewQueryRequest)
        );
        // 获取封装类
        return ResultUtils.success(mockInterviewPage);
    }

    // endregion

    /**
     * 处理模拟面试事件
     *
     * @param mockInterviewEventRequest 模拟面试事件请求
     * @param request                   HTTP 请求
     * @return AI 给出的回复
     */
    @PostMapping("/handleEvent")
    public BaseResponse<String> handleMockInterviewEvent(@RequestBody MockInterviewEventRequest mockInterviewEventRequest,
                                                         HttpServletRequest request) {
        // 获取当前登录用户
        User loginUser = userService.getLoginUser(request);
        // 调用 Service 处理模拟面试事件
        String aiResponse = mockInterviewService.handleMockInterviewEvent(mockInterviewEventRequest, loginUser);
        // 返回 AI 的回复
        return ResultUtils.success(aiResponse);
    }
}