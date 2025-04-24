package com.cool.pandora.mapper.question;

import com.cool.model.entity.question.Question;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cool.model.entity.question.QuestionCode;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
* 
* @description 针对表【question(题目)】的数据库操作Mapper
* @createDate 2024-08-24 21:46:47
* @Entity com.cool.pandora.model.entity.question.Question
*/
public interface QuestionMapper extends BaseMapper<Question> {

    /**
     * 查询题目列表（包括已被删除的数据）
     */
    @Select("select * from question where updateTime >= #{minUpdateTime}")
    List<Question> listQuestionWithDelete(Date minUpdateTime);
}
