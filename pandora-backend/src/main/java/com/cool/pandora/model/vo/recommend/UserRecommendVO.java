package com.cool.pandora.model.vo.recommend;

import com.cool.pandora.model.vo.UserVO;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class UserRecommendVO implements Serializable {
    
    // /**
    //  * id
    //  */
    // private Long id;
    
    /**
     * 被推荐的用户id
     */
    private Long recommendUserId;

    /**
     * 推荐的用户
     */
    private UserVO recommendUser;
    
    /**
     * 推荐分数
     */
    private Float score;
    
    /**
     * 推荐原因
     */
    private String reason;
    
    /**
     * 共同标签
     */
    private List<String> tags;
    
    /**
     * 推荐状态
     */
    private Integer status;

    private static final long serialVersionUID = 1L;
}