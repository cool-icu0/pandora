package com.cool.pandora.model.vo.recommend;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
public class QuestionRecommendVO implements Serializable {
    
    /**
     * id
     */
    private Long id;
    
    /**
     * 题目id
     */
    private Long questionId;
    
    /**
     * 推荐分数
     */
    private Float score;
    
    /**
     * 推荐原因
     */
    private String reason;
    
    /**
     * 推荐类型
     */
    private String type;
    
    /**
     * 状态
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    private Date createTime;

    // 新增题目详细信息字段
    private String questionTitle;

    private String questionDifficulty;

    private List<String> questionTags;


    private static final long serialVersionUID = 1L;
}