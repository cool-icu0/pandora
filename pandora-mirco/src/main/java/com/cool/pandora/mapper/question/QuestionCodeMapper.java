package com.cool.pandora.mapper.question;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cool.pandora.model.entity.question.QuestionCode;
import org.apache.ibatis.annotations.Select;

import java.util.Date;
import java.util.List;

/**
 * @Author Cool
 * @Date 2025/3/6 上午10:34
 */

public interface QuestionCodeMapper extends BaseMapper<QuestionCode> {

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
    List<QuestionCode> selectRecentCompletedQuestions(Long userId, Date oneMonthAgo);

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
