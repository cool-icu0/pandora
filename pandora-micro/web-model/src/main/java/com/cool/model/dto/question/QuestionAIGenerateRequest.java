package com.cool.model.dto.question;

import lombok.Data;

import java.io.Serializable;

/**
 * AI 生成题目请求
 *
 */
@Data
public class QuestionAIGenerateRequest implements Serializable {

    /**
     * 题目类型，比如 Java
     */
    private String questionType;

    /**
     * 题目数量，比如 10
     */
    private int number = 10;

    private static final long serialVersionUID = 1L;
}