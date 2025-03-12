package com.cool.pandora.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.entity.PostViews;

/**
 * 题目服务

 */
public interface PostViewsService extends IService<PostViews> {

    /**
     * 获取帖子浏览量
     *
     * @param postId 题目ID
     * @return 浏览量
     */
    long getPostViews(Long postId);

    /**
     * 同步Redis中的浏览量数据到MySQL
     */
    void syncViewCountPostToDb();

    /**
     * 增加浏览量
     * @param postId 题目ID
     * @return 是否成功
     */
    boolean addPostViews(Long postId);
}
