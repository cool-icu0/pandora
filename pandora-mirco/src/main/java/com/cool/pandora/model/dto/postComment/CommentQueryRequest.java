package com.cool.pandora.model.dto.postComment;

import com.cool.pandora.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 查询评论请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class CommentQueryRequest extends PageRequest implements Serializable {

    /**
     * 帖子ID
     */
    private Long postId;

    /**
     * 根评论ID，用于查询二级评论
     */
    private Long rootId;

    /**
     * 评论用户ID
     */
    private Long userId;

    /**
     * 排序字段，可选值：heat-热度，createTime-创建时间
     */
    private String sortField;

    /**
     * 排序方式，可选值：asc-升序，desc-降序
     */
    private String sortOrder;

    private static final long serialVersionUID = 1L;
}