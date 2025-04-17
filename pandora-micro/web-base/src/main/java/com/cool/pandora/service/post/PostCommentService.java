package com.cool.pandora.service.post;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.dto.postComment.CommentAddRequest;
import com.cool.pandora.model.dto.postComment.CommentQueryRequest;
import com.cool.pandora.model.dto.postComment.CommentUpdateRequest;
import com.cool.pandora.model.entity.post.PostComment;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.model.vo.CommentVO;

/**
 * 帖子评论服务
 */
public interface PostCommentService extends IService<PostComment> {

    /**
     * 校验评论是否合法
     * @param comment 评论
     * @param add 是否为创建校验
     */
    void validComment(PostComment comment, boolean add);

    /**
     * 获取查询条件
     *
     * @param commentQueryRequest
     * @return
     */
    QueryWrapper<PostComment> getQueryWrapper(CommentQueryRequest commentQueryRequest);

    /**
     * 获取评论封装
     *
     * @param comment
     * @param loginUser
     * @return
     */
    CommentVO getCommentVO(PostComment comment, User loginUser);

    /**
     * 分页获取评论封装
     *
     * @param commentPage
     * @param loginUser
     * @return
     */
    Page<CommentVO> getCommentVOPage(Page<PostComment> commentPage, User loginUser);

    /**
     * 创建评论
     * @param commentAddRequest
     * @param loginUser
     * @return
     */
    Long addComment(CommentAddRequest commentAddRequest, User loginUser);

    /**
     * 更新评论
     * @param commentUpdateRequest
     * @param loginUser
     * @return
     */
    boolean updateComment(CommentUpdateRequest commentUpdateRequest, User loginUser);

    /**
     * 删除评论
     * @param id
     * @param loginUser
     * @return
     */
    boolean deleteComment(long id, User loginUser);

    /**
     * 分页获取评论列表
     * @param commentQueryRequest
     * @param loginUser
     * @return
     */
    Page<CommentVO> listCommentVOByPage(CommentQueryRequest commentQueryRequest, User loginUser);
}