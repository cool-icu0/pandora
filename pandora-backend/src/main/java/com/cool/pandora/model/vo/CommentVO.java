package com.cool.pandora.model.vo;
import com.cool.pandora.model.entity.PostComment;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 评论视图对象
 */
@Data
public class CommentVO implements Serializable {

    /**
     * 评论ID
     */
    private Long id;

    /**
     * 帖子ID
     */
    private Long postId;

    /**
     * 评论用户ID
     */
    private Long userId;

    /**
     * 评论用户信息
     */
    private UserVO userVO;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 父评论ID
     */
    private Long parentId;

    /**
     * 根评论ID
     */
    private Long rootId;

    /**
     * 回复用户ID
     */
    private Long replyUserId;

    /**
     * 回复用户信息
     */
    private UserVO replyUserVO;

    /**
     * 点赞数
     */
    private Integer thumbNum;

    /**
     * 回复数量
     */
    private Integer replyCount;

    /**
     * 评论层级
     */
    private Integer level;

    /**
     * 是否已点赞
     */
    private Boolean hasThumb;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 子评论列表（二级评论）
     */
    private List<CommentVO> children;

    /**
     * 包装类转对象
     *
     * @param commentVO
     * @return
     */
    public static PostComment voToObj(CommentVO commentVO) {
        if (commentVO == null) {
            return null;
        }
        PostComment comment = new PostComment();
        comment.setId(commentVO.getId());
        comment.setPostId(commentVO.getPostId());
        comment.setUserId(commentVO.getUserId());
        comment.setContent(commentVO.getContent());
        comment.setParentId(commentVO.getParentId());
        comment.setRootId(commentVO.getRootId());
        comment.setReplyUserId(commentVO.getReplyUserId());
        comment.setThumbNum(commentVO.getThumbNum());
        comment.setReplyCount(commentVO.getReplyCount());
        comment.setLevel(commentVO.getLevel());
        return comment;
    }

    /**
     * 对象转包装类
     *
     * @param comment
     * @return
     */
    public static CommentVO objToVo(PostComment comment) {
        if (comment == null) {
            return null;
        }
        CommentVO commentVO = new CommentVO();
        commentVO.setId(comment.getId());
        commentVO.setPostId(comment.getPostId());
        commentVO.setUserId(comment.getUserId());
        commentVO.setContent(comment.getContent());
        commentVO.setParentId(comment.getParentId());
        commentVO.setRootId(comment.getRootId());
        commentVO.setReplyUserId(comment.getReplyUserId());
        commentVO.setThumbNum(comment.getThumbNum());
        commentVO.setReplyCount(comment.getReplyCount());
        commentVO.setLevel(comment.getLevel());
        commentVO.setCreateTime(comment.getCreateTime());
        return commentVO;
    }

    private static final long serialVersionUID = 1L;
}