package com.cool.pandora.model.entity.question;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

@Data
@TableName("question_views")
public class QuestionViews {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long questionId;

    private Long viewCount;

    private Date createTime;

    private Date updateTime;
}