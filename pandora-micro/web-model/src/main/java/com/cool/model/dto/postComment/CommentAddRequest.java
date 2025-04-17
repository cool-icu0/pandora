package com.cool.model.dto.postComment;

import lombok.Data;

import java.io.Serializable;

/**
 * 创建评论请求
 */
@Data
public class CommentAddRequest implements Serializable {

    /**
     * 帖子ID
     */
    private Long postId;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 父评论ID，如果是一级评论则为NULL
     */
    private Long parentId;

    /**
     * 根评论ID，如果是一级评论则为NULL
     */
    private Long rootId;

    /**
     * 回复用户ID，如果是一级评论则为NULL
     */
    private Long replyUserId;

    private static final long serialVersionUID = 1L;
}