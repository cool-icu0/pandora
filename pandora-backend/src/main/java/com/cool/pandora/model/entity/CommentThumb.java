package com.cool.pandora.model.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 评论点赞实体
 */
@TableName(value = "comment_thumb")
@Data
public class CommentThumb implements Serializable {

    /**
     * ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 评论ID
     */
    private Long commentId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}