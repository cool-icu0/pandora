package com.cool.pandora.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.dto.mockinterview.MockInterviewAddRequest;
import com.cool.pandora.model.dto.mockinterview.MockInterviewEventRequest;
import com.cool.pandora.model.dto.mockinterview.MockInterviewQueryRequest;
import com.cool.pandora.model.entity.MockInterview;
import com.cool.pandora.model.entity.User;

/**

 * @description 针对表【mock_interview(模拟面试)】的数据库操作Service
 * @createDate 2025-02-26 17:16:07
 */
public interface MockInterviewService extends IService<MockInterview> {

    /**
     * 创建模拟面试
     *
     * @param mockInterviewAddRequest
     * @param loginUser
     * @return
     */
    Long createMockInterview(MockInterviewAddRequest mockInterviewAddRequest, User loginUser);

    /**
     * 构造查询条件
     *
     * @param mockInterviewQueryRequest
     * @return
     */
    QueryWrapper<MockInterview> getQueryWrapper(MockInterviewQueryRequest mockInterviewQueryRequest);

    /**
     * 处理模拟面试事件
     * @param mockInterviewEventRequest
     * @param loginUser
     * @return AI 给出的回复
     */
    String handleMockInterviewEvent(MockInterviewEventRequest mockInterviewEventRequest, User loginUser);
}
