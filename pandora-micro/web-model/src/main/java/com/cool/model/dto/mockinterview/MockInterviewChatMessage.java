package com.cool.model.dto.mockinterview;

import lombok.Data;

import java.io.Serializable;

/**
 * 模拟面试消息记录
 */
@Data
public class MockInterviewChatMessage implements Serializable {

    private static final long serialVersionUID = -2056799733159215147L;

    /**
     * 角色
     */
    private String role;

    /**
     * 消息内容
     */
    private String message;

}
