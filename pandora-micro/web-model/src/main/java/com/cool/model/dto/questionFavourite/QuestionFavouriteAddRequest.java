package com.cool.model.dto.questionFavourite;

import lombok.Data;

import java.io.Serializable;

/**
 * 题目收藏请求
 */
@Data
public class QuestionFavouriteAddRequest implements Serializable {

    /**
     * 题目 id
     */
    private Long questionId;

    private static final long serialVersionUID = 1L;
}