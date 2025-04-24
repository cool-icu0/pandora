package com.cool.heart.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cool.model.entity.recommend.QuestionRecommend;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface QuestionRecommendMapper extends BaseMapper<QuestionRecommend> {
    
    @Select("select * from question_recommend where userId = #{userId} " +
            "${type != null ? 'and type = #{type}' : ''} " +
            "${status != null ? 'and status = #{status}' : ''} " +
            "and isDelete = 0 order by score desc, createTime desc")
    List<QuestionRecommend> listQuestionRecommends(@Param("userId") Long userId, 
                                                 @Param("type") String type,
                                                 @Param("status") Integer status);
    
    @Update("update question_recommend set status = #{status}, updateTime = now() " +
            "where userId = #{userId} and questionId = #{questionId} and isDelete = 0")
    int updateRecommendStatus(@Param("userId") Long userId, 
                            @Param("questionId") Long questionId, 
                            @Param("status") Integer status);
    
    @Insert("<script>" +
            "insert into question_recommend (userId, questionId, score, reason, type, status) values " +
            "<foreach collection='recommendList' item='item' separator=','>" +
            "(#{item.userId}, #{item.questionId}, #{item.score}, #{item.reason}, #{item.type}, #{item.status})" +
            "</foreach>" +
            "</script>")
    int insertBatch(@Param("recommendList") List<QuestionRecommend> recommendList);
}