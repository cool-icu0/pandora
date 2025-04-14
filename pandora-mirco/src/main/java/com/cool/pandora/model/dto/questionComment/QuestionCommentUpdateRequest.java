package com.cool.pandora.model.dto.questionComment;

import lombok.Data;

import java.io.Serializable;

/**
 * 题目评论更新请求
 */
@Data
public class QuestionCommentUpdateRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 评论内容
     */
    private String content;

    private static final long serialVersionUID = 1L;
}