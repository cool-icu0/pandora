package com.cool.pandora.service.post.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.common.common.ErrorCode;
import com.cool.common.constant.CommonConstant;
import com.cool.common.exception.BusinessException;
import com.cool.pandora.mapper.post.CommentThumbMapper;
import com.cool.pandora.mapper.post.PostCommentMapper;
import com.cool.pandora.mapper.post.PostMapper;
import com.cool.pandora.mapper.UserMapper;
import com.cool.model.dto.postComment.CommentAddRequest;
import com.cool.model.dto.postComment.CommentQueryRequest;
import com.cool.model.dto.postComment.CommentUpdateRequest;
import com.cool.model.entity.post.CommentThumb;
import com.cool.model.entity.post.Post;
import com.cool.model.entity.post.PostComment;
import com.cool.model.entity.User;
import com.cool.model.vo.CommentVO;
import com.cool.model.vo.UserVO;
import com.cool.pandora.service.post.PostCommentService;
import com.cool.pandora.service.user.UserService;
import com.cool.common.utils.SqlUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 帖子评论服务实现
 */
@Service
public class PostCommentServiceImpl extends ServiceImpl<PostCommentMapper, PostComment> implements PostCommentService {

    @Resource
    private PostMapper postMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private UserService userService;

    @Resource
    private CommentThumbMapper commentThumbMapper;

    /**
     * 校验评论是否合法
     *
     * @param comment 评论
     * @param add 是否为创建校验
     */
    @Override
    public void validComment(PostComment comment, boolean add) {
        if (comment == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        String content = comment.getContent();
        Long postId = comment.getPostId();
        
        // 创建时，参数不能为空
        if (add) {
            if (StringUtils.isBlank(content) || ObjectUtils.isEmpty(postId)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
            }
        }
        
        // 有参数则校验
        if (StringUtils.isNotBlank(content) && content.length() > 1000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评论内容过长");
        }
        
        // 校验帖子是否存在
        if (postId != null) {
            Post post = postMapper.selectById(postId);
            if (post == null || post.getIsDelete() == 1) {
                throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "帖子不存在");
            }
        }
    }

    /**
     * 获取查询条件
     *
     * @param commentQueryRequest 查询条件
     * @return 查询包装器
     */
    @Override
    public QueryWrapper<PostComment> getQueryWrapper(CommentQueryRequest commentQueryRequest) {
        QueryWrapper<PostComment> queryWrapper = new QueryWrapper<>();
        if (commentQueryRequest == null) {
            return queryWrapper;
        }
        
        Long postId = commentQueryRequest.getPostId();
        Long rootId = commentQueryRequest.getRootId();
        Long userId = commentQueryRequest.getUserId();
        String sortField = commentQueryRequest.getSortField();
        String sortOrder = commentQueryRequest.getSortOrder();
        
        // 拼接查询条件
        queryWrapper.eq(ObjectUtils.isNotEmpty(postId), "postId", postId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(rootId), "rootId", rootId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.eq("isDelete", 0);
        
        // 一级评论查询
        if (rootId == null && postId != null) {
            queryWrapper.isNull("rootId");
        }
        
        // 排序
        sortField = StringUtils.isEmpty(sortField) ? "createTime" : sortField;
        sortOrder = StringUtils.isEmpty(sortOrder) ? CommonConstant.SORT_ORDER_DESC : sortOrder;
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        
        return queryWrapper;
    }

    /**
     * 获取评论VO
     *
     * @param comment 评论实体
     * @param loginUser 当前登录用户
     * @return 评论VO
     */
    @Override
    public CommentVO getCommentVO(PostComment comment, User loginUser) {
        if (comment == null) {
            return null;
        }
        
        CommentVO commentVO = CommentVO.objToVo(comment);
        
        // 1. 关联查询用户信息
        Long userId = comment.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userMapper.selectById(userId);
        }
        UserVO userVO = userService.getUserVO(user);
        commentVO.setUserVO(userVO);
        
        // 2. 已登录，获取点赞状态
        if (loginUser != null) {
            // 获取点赞
            QueryWrapper<CommentThumb> thumbQueryWrapper = new QueryWrapper<>();
            thumbQueryWrapper.eq("userId", loginUser.getId());
            thumbQueryWrapper.eq("commentId", comment.getId());
            CommentThumb commentThumb = commentThumbMapper.selectOne(thumbQueryWrapper);
            commentVO.setHasThumb(commentThumb != null);
        }
        
        // 3. 关联查询回复用户信息
        Long replyUserId = comment.getReplyUserId();
        if (replyUserId != null && replyUserId > 0) {
            User replyUser = userMapper.selectById(replyUserId);
            UserVO replyUserVO = userService.getUserVO(replyUser);
            commentVO.setReplyUserVO(replyUserVO);
        }
        
        return commentVO;
    }

    /**
     * 分页获取评论VO
     *
     * @param commentPage 评论分页
     * @param loginUser 当前登录用户
     * @return 评论VO分页
     */
    @Override
    public Page<CommentVO> getCommentVOPage(Page<PostComment> commentPage, User loginUser) {
        List<PostComment> commentList = commentPage.getRecords();
        Page<CommentVO> commentVOPage = new Page<>(commentPage.getCurrent(), commentPage.getSize(), commentPage.getTotal());
        if (CollectionUtils.isEmpty(commentList)) {
            return commentVOPage;
        }
        
        // 1. 关联查询用户信息
        Set<Long> userIdSet = commentList.stream().map(PostComment::getUserId).collect(Collectors.toSet());
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));
        
        // 2. 已登录，获取点赞状态
        Map<Long, Boolean> commentIdHasThumbMap = new HashMap<>();
        if (loginUser != null) {
            Set<Long> commentIdSet = commentList.stream().map(PostComment::getId).collect(Collectors.toSet());
            QueryWrapper<CommentThumb> thumbQueryWrapper = new QueryWrapper<>();
            thumbQueryWrapper.in("commentId", commentIdSet);
            thumbQueryWrapper.eq("userId", loginUser.getId());
            List<CommentThumb> commentThumbList = commentThumbMapper.selectList(thumbQueryWrapper);
            commentIdHasThumbMap = commentThumbList.stream()
                    .collect(Collectors.toMap(CommentThumb::getCommentId, commentThumb -> true));
        }

        // 3. 关联查询回复用户信息
        Set<Long> replyUserIdSet = commentList.stream()
                .map(PostComment::getReplyUserId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, List<User>> replyUserIdUserListMap = new HashMap<>();
        if (!replyUserIdSet.isEmpty()) {
            replyUserIdUserListMap = userService.listByIds(replyUserIdSet).stream()
                    .collect(Collectors.groupingBy(User::getId));
        }

        // 填充信息
        Map<Long, List<User>> finalReplyUserIdUserListMap = replyUserIdUserListMap;
        Map<Long, Boolean> finalCommentIdHasThumbMap = commentIdHasThumbMap;
        List<CommentVO> commentVOList = commentList.stream().map(comment -> {
            CommentVO commentVO = CommentVO.objToVo(comment);
            
            // 填充用户信息
            Long userId = comment.getUserId();
            User user = null;
            if (userIdUserListMap.containsKey(userId)) {
                user = userIdUserListMap.get(userId).get(0);
            }
            commentVO.setUserVO(userService.getUserVO(user));
            
            // 填充点赞状态
            commentVO.setHasThumb(finalCommentIdHasThumbMap.getOrDefault(comment.getId(), false));
            
            // 填充回复用户信息
            Long replyUserId = comment.getReplyUserId();
            if (replyUserId != null && finalReplyUserIdUserListMap.containsKey(replyUserId)) {
                User replyUser = finalReplyUserIdUserListMap.get(replyUserId).get(0);
                commentVO.setReplyUserVO(userService.getUserVO(replyUser));
            }
            
            return commentVO;
        }).collect(Collectors.toList());
        
        commentVOPage.setRecords(commentVOList);
        return commentVOPage;
    }

    /**
     * 创建评论
     *
     * @param commentAddRequest 创建评论请求
     * @param loginUser 当前登录用户
     * @return 评论ID
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addComment(CommentAddRequest commentAddRequest, User loginUser) {
        if (commentAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        PostComment comment = new PostComment();
        comment.setPostId(commentAddRequest.getPostId());
                comment.setContent(commentAddRequest.getContent());
        comment.setUserId(loginUser.getId());

        // 处理父评论和根评论
        Long parentId = commentAddRequest.getParentId();
        Long replyUserId = commentAddRequest.getReplyUserId();

        // 如果有父评论，需要设置根评论和层级
        if (parentId != null && parentId > 0) {
            PostComment parentComment = this.getById(parentId);
            if (parentComment == null) {
                throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "父评论不存在");
            }

            // 如果父评论是一级评论，则根评论就是父评论
            if (parentComment.getRootId() == null) {
                comment.setRootId(parentId);
                comment.setLevel(2);
            } else {
                // 如果父评论不是一级评论，则根评论是父评论的根评论
                comment.setRootId(parentComment.getRootId());
                comment.setLevel(parentComment.getLevel() + 1);
            }

            comment.setParentId(parentId);
            comment.setReplyUserId(replyUserId != null ? replyUserId : parentComment.getUserId());

            // 更新父评论的回复数
            boolean updateResult = this.update()
                    .setSql("replyCount = replyCount + 1")
                    .eq("id", parentId)
                    .update();
            if (!updateResult) {
                throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新父评论回复数失败");
            }

            // 如果有根评论，也要更新根评论的回复数
            if (comment.getRootId() != null && !comment.getRootId().equals(parentId)) {
                updateResult = this.update()
                        .setSql("replyCount = replyCount + 1")
                        .eq("id", comment.getRootId())
                        .update();
                if (!updateResult) {
                    throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新根评论回复数失败");
                }
            }
        }

        // 校验评论内容
        validComment(comment, true);

        // 保存评论
        boolean result = this.save(comment);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "评论创建失败");
        }

        return comment.getId();
    }

    /**
     * 更新评论
     *
     * @param commentUpdateRequest 更新评论请求
     * @param loginUser 当前登录用户
     * @return 是否成功
     */
    @Override
    public boolean updateComment(CommentUpdateRequest commentUpdateRequest, User loginUser) {
        if (commentUpdateRequest == null || commentUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 判断是否存在
        Long id = commentUpdateRequest.getId();
        PostComment oldComment = this.getById(id);
        if (oldComment == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 仅本人或管理员可编辑
        if (!oldComment.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }

        PostComment comment = new PostComment();
        comment.setId(id);
        comment.setContent(commentUpdateRequest.getContent());

        // 参数校验
        validComment(comment, false);

        return this.updateById(comment);
    }

    /**
     * 删除评论
     *
     * @param id 评论ID
     * @param loginUser 当前登录用户
     * @return 是否成功
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteComment(long id, User loginUser) {
        // 判断是否存在
        PostComment comment = this.getById(id);
        if (comment == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 仅本人或管理员可删除
        if (!comment.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }

        // 如果是一级评论，需要删除所有子评论
        if (comment.getRootId() == null) {
            // 查询所有子评论
            QueryWrapper<PostComment> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("rootId", id);
            boolean removeResult = this.remove(queryWrapper);
            if (!removeResult) {
                throw new BusinessException(ErrorCode.OPERATION_ERROR, "删除子评论失败");
            }
        } else {
            // 如果是子评论，需要更新父评论和根评论的回复数
            Long parentId = comment.getParentId();
            if (parentId != null) {
                boolean updateResult = this.update()
                        .setSql("replyCount = replyCount - 1")
                        .eq("id", parentId)
                        .update();
                if (!updateResult) {
                    throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新父评论回复数失败");
                }
            }

            Long rootId = comment.getRootId();
            if (rootId != null && !rootId.equals(parentId)) {
                boolean updateResult = this.update()
                        .setSql("replyCount = replyCount - 1")
                        .eq("id", rootId)
                        .update();
                if (!updateResult) {
                    throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新根评论回复数失败");
                }
            }
        }

        return this.removeById(id);
    }

    /**
     * 分页获取评论列表
     *
     * @param commentQueryRequest 查询条件
     * @param loginUser 当前登录用户
     * @return 评论VO分页
     */
    @Override
    public Page<CommentVO> listCommentVOByPage(CommentQueryRequest commentQueryRequest, User loginUser) {
        long current = commentQueryRequest.getCurrent();
        long size = commentQueryRequest.getPageSize();

        // 限制爬虫
        if (size > 5000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Page<PostComment> commentPage = this.page(new Page<>(current, size),
                this.getQueryWrapper(commentQueryRequest));

        // 获取评论VO
        Page<CommentVO> commentVOPage = this.getCommentVOPage(commentPage, loginUser);

        // 如果是查询一级评论，需要查询每个一级评论的部分二级评论
        if (commentQueryRequest.getRootId() == null && commentQueryRequest.getPostId() != null) {
            // 获取一级评论ID列表
            List<Long> rootCommentIds = commentVOPage.getRecords().stream()
                    .map(CommentVO::getId)
                    .collect(Collectors.toList());

            if (!rootCommentIds.isEmpty()) {
                // 查询每个一级评论的前3条二级评论
                Map<Long, List<CommentVO>> rootIdCommentsMap = new HashMap<>();
                for (Long rootCommentId : rootCommentIds) {
                    CommentQueryRequest subCommentRequest = new CommentQueryRequest();
                    subCommentRequest.setRootId(rootCommentId);
                    subCommentRequest.setPostId(commentQueryRequest.getPostId());
                    subCommentRequest.setCurrent(1);
                    subCommentRequest.setPageSize(3);

                    Page<PostComment> subCommentPage = this.page(new Page<>(1, 3),
                            this.getQueryWrapper(subCommentRequest));
                    Page<CommentVO> subCommentVOPage = this.getCommentVOPage(subCommentPage, loginUser);

                    rootIdCommentsMap.put(rootCommentId, subCommentVOPage.getRecords());
                }

                // 填充子评论
                for (CommentVO commentVO : commentVOPage.getRecords()) {
                    Long rootId = commentVO.getId();
                    if (rootIdCommentsMap.containsKey(rootId)) {
                        commentVO.setChildren(rootIdCommentsMap.get(rootId));
                    }
                }
            }
        }

        return commentVOPage;
    }
}