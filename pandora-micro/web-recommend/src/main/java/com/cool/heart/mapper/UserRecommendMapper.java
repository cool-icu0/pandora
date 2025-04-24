package com.cool.heart.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cool.model.entity.recommend.UserRecommend;
import org.apache.ibatis.annotations.*;

import java.util.List;

public interface UserRecommendMapper extends BaseMapper<UserRecommend> {
    
    @Select("select * from user_recommend where userId = #{userId} " +
            "${status != null ? 'and status = #{status}' : ''} " +
            "and isDelete = 0 order by score desc, createTime desc")
    List<UserRecommend> listUserRecommends(@Param("userId") Long userId, @Param("status") Integer status);
    
    @Update("update user_recommend set status = #{status}, updateTime = now() " +
            "where userId = #{userId} and recommendUserId = #{recommendUserId} and isDelete = 0")
    int updateRecommendStatus(@Param("userId") Long userId, 
                            @Param("recommendUserId") Long recommendUserId, 
                            @Param("status") Integer status);
    
    @Insert("<script>" +
            "insert into user_recommend (userId, recommendUserId, score, reason, tags, status) values " +
            "<foreach collection='recommendList' item='item' separator=','>" +
            "(#{item.userId}, #{item.recommendUserId}, #{item.score}, #{item.reason}, #{item.tags}, #{item.status})" +
            "</foreach>" +
            "</script>")
    int insertBatch(@Param("recommendList") List<UserRecommend> recommendList);
}