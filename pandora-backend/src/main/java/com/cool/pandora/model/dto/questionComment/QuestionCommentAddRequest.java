package com.cool.pandora.model.dto.questionComment;

import lombok.Data;

import java.io.Serializable;

/**
 * 题目评论创建请求
 */
@Data
public class QuestionCommentAddRequest implements Serializable {

    /**
     * 题目 id
     */
    private Long questionId;

    /**
     * 评论内容
     */
    private String content;

    private static final long serialVersionUID = 1L;
}