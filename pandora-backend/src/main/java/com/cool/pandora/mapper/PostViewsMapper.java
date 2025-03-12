package com.cool.pandora.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cool.pandora.model.entity.PostViews;
import com.cool.pandora.model.entity.QuestionViews;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostViewsMapper extends BaseMapper<PostViews> {
}