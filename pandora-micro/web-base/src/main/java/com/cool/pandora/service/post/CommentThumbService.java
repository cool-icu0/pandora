package com.cool.pandora.service.post;


import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.entity.post.CommentThumb;
import com.cool.pandora.model.entity.User;

/**
 * 评论点赞服务
 */
public interface CommentThumbService extends IService<CommentThumb> {

    /**
     * 点赞
     *
     * @param commentId
     * @param loginUser
     * @return
     */
    int doThumb(long commentId, User loginUser);

    /**
     * 帖子点赞（内部服务）
     *
     * @param userId
     * @param commentId
     * @return
     */
    int doThumbInner(long userId, long commentId);
}