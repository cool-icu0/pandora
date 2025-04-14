package com.cool.pandora.model.dto.recommend;

import lombok.Data;

import java.io.Serializable;

@Data
public class UserRecommendRequest implements Serializable {
    
    /**
     * 用户id
     */
    private Long userId;
    
    /**
     * 推荐状态（可选）
     */
    private Integer status;
    
    /**
     * 每页条数
     */
    private Integer pageSize = 10;
    
    /**
     * 当前页号
     */
    private Integer current = 1;

    private static final long serialVersionUID = 1L;
}