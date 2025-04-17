package com.cool.model.enums;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;

/**
 * 事件类型枚举

 */
public enum MockInterviewEventEnum {

    START("开始", "start"),
    CHAT("聊天", "chat"),
    END("结束", "end");

    private final String text; // 事件描述
    private final String value; // 事件值

    MockInterviewEventEnum(String text, String value) {
        this.text = text;
        this.value = value;
    }

    /**
     * 获取所有事件的值列表
     *
     * @return
     */
    public static List<String> getValues() {
        return Arrays.stream(values()).map(item -> item.value).collect(Collectors.toList());
    }

    /**
     * 根据 value 获取枚举
     *
     * @param value
     * @return
     */
    public static MockInterviewEventEnum getEnumByValue(String value) {
        if (ObjectUtils.isEmpty(value)) {
            return null;
        }
        for (MockInterviewEventEnum anEnum : MockInterviewEventEnum.values()) {
            if (anEnum.value.equals(value)) {
                return anEnum;
            }
        }
        return null;
    }

    public String getValue() {
        return value;
    }

    public String getText() {
        return text;
    }
}