package com.cool.pandora.model.entity.recommend;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@TableName(value = "user_recommend")
@Data
public class UserRecommend implements Serializable {
    
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID，关联推荐人的用户
     */
    private Long userId;

    /**
     * 被推荐用户ID
     */
    private Long recommendUserId;

    /**
     * 评分，用户对推荐的评价
     */
    private Float score;

    /**
     * 推荐理由
     */
    private String reason;

    /**
     * 标签，用于分类或标记推荐
     * 标签系统允许对推荐进行分类管理，便于后续的数据分析和个性化推荐
     */
    private String tags;

    /**
     * 状态，表示推荐的有效性或处理状态
     * 通过整数表示推荐的不同状态，如有效、待审核、已拒绝等
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
     * 逻辑删除标志
     */
    @TableLogic
    private Integer isDelete;

    private static final long serialVersionUID = 1L;
}