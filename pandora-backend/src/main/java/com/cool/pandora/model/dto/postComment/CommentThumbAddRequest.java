package com.cool.pandora.model.dto.postComment;

import lombok.Data;

import java.io.Serializable;

/**
 * 评论点赞请求
 */
@Data
public class CommentThumbAddRequest implements Serializable {

    /**
     * 评论ID
     */
    private Long commentId;

    private static final long serialVersionUID = 1L;
}