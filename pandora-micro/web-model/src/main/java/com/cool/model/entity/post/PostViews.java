package com.cool.model.entity.post;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("post_views")
public class PostViews {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long postId;

    private Long viewCount;

    private Date createTime;

    private Date updateTime;
}