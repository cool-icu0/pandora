package com.cool.pandora.service.post.impl;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.common.common.ErrorCode;
import com.cool.common.exception.BusinessException;
import com.cool.pandora.mapper.post.CommentThumbMapper;
import com.cool.pandora.mapper.post.PostCommentMapper;
import com.cool.model.entity.post.CommentThumb;
import com.cool.model.entity.post.PostComment;
import com.cool.model.entity.User;
import com.cool.pandora.service.post.CommentThumbService;
import com.cool.pandora.service.post.PostCommentService;
import org.springframework.aop.framework.AopContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

/**
 * 评论点赞服务实现
 */
@Service
public class CommentThumbServiceImpl extends ServiceImpl<CommentThumbMapper, CommentThumb> implements CommentThumbService {

    @Resource
    private PostCommentMapper postCommentMapper;

    @Resource
    private PostCommentService postCommentService;

    /**
     * 点赞
     *
     * @param commentId 评论id
     * @param loginUser 登录用户
     * @return 点赞结果，1-点赞，0-取消点赞
     */
    @Override
    public int doThumb(long commentId, User loginUser) {
        // 判断实体是否存在，根据类别获取实体
        PostComment comment = postCommentMapper.selectById(commentId);
        if (comment == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已点赞
        long userId = loginUser.getId();
        // 每个用户串行点赞
        // 锁必须要包裹住事务方法
        CommentThumbService commentThumbService = (CommentThumbService) AopContext.currentProxy();
        return commentThumbService.doThumbInner(userId, commentId);
    }

    /**
     * 内部点赞方法，事务包裹
     *
     * @param userId 用户id
     * @param commentId 评论id
     * @return 点赞结果，1-点赞，0-取消点赞
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int doThumbInner(long userId, long commentId) {
        CommentThumb commentThumb = new CommentThumb();
        commentThumb.setUserId(userId);
        commentThumb.setCommentId(commentId);
        QueryWrapper<CommentThumb> thumbQueryWrapper = new QueryWrapper<>(commentThumb);
        CommentThumb oldCommentThumb = this.getOne(thumbQueryWrapper);
        boolean result;
        // 已点赞
        if (oldCommentThumb != null) {
            result = this.remove(thumbQueryWrapper);
            if (result) {
                // 点赞数 - 1
                result = postCommentService.update()
                        .eq("id", commentId)
                        .setSql("thumbNum = thumbNum - 1")
                        .update();
                return result ? 0 : -1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR);
            }
        } else {
            // 未点赞
            result = this.save(commentThumb);
            if (result) {
                // 点赞数 + 1
                result = postCommentService.update()
                        .eq("id", commentId)
                        .setSql("thumbNum = thumbNum + 1")
                        .update();
                return result ? 1 : -1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR);
            }
        }
    }
}