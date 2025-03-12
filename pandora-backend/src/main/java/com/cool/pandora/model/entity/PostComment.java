package com.cool.pandora.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 帖子评论实体
 */
@TableName(value = "post_comment")
@Data
public class PostComment implements Serializable {

    /**
     * 评论ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 帖子ID
     */
    private Long postId;

    /**
     * 评论用户ID
     */
    private Long userId;

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

    /**
     * 点赞数
     */
    private Integer thumbNum;

    /**
     * 回复数量
     */
    private Integer replyCount;

    /**
     * 热度值，用于排序
     */
    private Integer heat;

    /**
     * 评论层级，1为一级评论，2为二级评论，以此类推
     */
    private Integer level;

    /**
     * 状态，0-正常，1-被举报，2-被删除
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除(0-未删除, 1-已删除)
     */
    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}