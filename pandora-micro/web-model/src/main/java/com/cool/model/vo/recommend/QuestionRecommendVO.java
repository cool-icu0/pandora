package com.cool.model.vo.recommend;

import com.cool.model.vo.QuestionCodeVO;
import lombok.Data;

import java.io.Serializable;

@Data
public class QuestionRecommendVO implements Serializable {
    
    // /**
    //  * id
    //  */
    // private Long id;
    
    /**
     * 题目id
     */
    private Long questionId;
    /**
     * 推荐题目
     */
    private QuestionCodeVO questionCodeVO;

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



    private static final long serialVersionUID = 1L;
}