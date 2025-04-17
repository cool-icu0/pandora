package com.cool.model.dto.questionFavourite;

import com.cool.common.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class QuestionFavouriteQueryRequest extends PageRequest {
    /**
     * 搜索关键词
     */
    private String searchText;
}