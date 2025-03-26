package com.cool.pandora.mapper.question;

import com.cool.pandora.model.entity.question.Question;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
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

    /**
     * 获取用户一个月内完成的题目数量
     */
    @Select("SELECT COUNT(DISTINCT q.id) " +
            "FROM question_code q " +
            "INNER JOIN question_submit s ON q.id = s.questionId " +
            "WHERE s.userId = #{userId} " +
            "AND s.submitState = 2 " +  // 假设 status = 1 表示完成
            "AND s.createTime >= #{oneMonthAgo} " +
            "AND s.isDelete = 0")
    Integer countUserCompletedQuestions(Long userId, Date oneMonthAgo);

    /**
     * 获取用户最近一个月完成的题目
     */
    @Select("SELECT DISTINCT q.* " +
            "FROM question_code q " +
            "INNER JOIN question_submit s ON q.id = s.questionId " +
            "WHERE s.userId = #{userId} " +
            "AND s.submitState = 2 " +  // 完成状态
            "AND s.createTime >= #{oneMonthAgo} " +
            "AND s.isDelete = 0 " +
            "AND q.isDelete = 0 ")
    List<Question> selectRecentCompletedQuestions(Long userId, Date oneMonthAgo);

    /**
     * 获取用户已完成的题目ID列表
     */
    @Select("SELECT DISTINCT q.id " +
            "FROM question_code q " +
            "INNER JOIN question_submit s ON q.id = s.questionId " +
            "WHERE s.userId = #{userId} " +
            "AND s.submitState = 2 " +  // 完成状态
            "AND s.isDelete = 0 " +
            "AND q.isDelete = 0")
    List<Long> selectCompletedQuestionIds(Long userId);
}
