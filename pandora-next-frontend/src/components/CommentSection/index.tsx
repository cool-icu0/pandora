"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Button, Divider, message, Space, Typography, Popconfirm, Input, List } from "antd";
import { LikeOutlined, LikeFilled, CommentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { listCommentByPageUsingPost, addCommentUsingPost, deleteCommentUsingPost, thumbCommentUsingPost } from "@/api/commentController";
import dayjs from "dayjs";
import CommentItem from "./CommentItem";
import "./index.css";

const { Text } = Typography;
const { TextArea } = Input;

interface CommentSectionProps {
  postId: number;
  loginUser: any;
  isLoggedIn: boolean;
  onCommentCountChange?: (count: number) => void;
}

/**
 * 评论区组件
 */
const CommentSection: React.FC<CommentSectionProps> = ({ postId, loginUser, isLoggedIn, onCommentCountChange }) => {
  // 评论相关状态
  const [comments, setComments] = useState<API.CommentVO[]>([]);
  const [commentContent, setCommentContent] = useState<string>("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyToUser, setReplyToUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  // 添加展示子评论的状态
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  // 获取评论列表
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await listCommentByPageUsingPost({
        postId,
        current: currentPage,
        pageSize: pageSize,
        sortField: 'createTime',
        sortOrder: 'descend',
      });
      
      if (res.data) {
        setComments((res.data as any)?.records || []);
        setCommentTotal((res.data as any)?.total || 0);
        // 通知父组件评论数量变化
        if (onCommentCountChange) {
          onCommentCountChange((res.data as any)?.total || 0);
        }
      }
    } catch (e: any) {
      message.error("获取评论失败：" + e.message);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取评论
  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, currentPage, pageSize]);

  /**
   * 提交评论
   */
  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      message.warning("请先登录");
      return;
    }

    if (!commentContent.trim()) {
      message.warning("评论内容不能为空");
      return;
    }

    try {
      await addCommentUsingPost({
        postId,
        content: commentContent,
        parentId: replyToId || undefined,
      });
      message.success("评论成功");
      setCommentContent("");
      setReplyToId(null);
      setReplyToUser(null);
      fetchComments(); // 重新获取评论列表
    } catch (e: any) {
      message.error("评论失败：" + e.message);
    }
  };

  /**
   * 删除评论
   */
  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentUsingPost({
        id: commentId,
      });
      message.success("删除成功");
      fetchComments(); // 重新获取评论列表
    } catch (e: any) {
      message.error("删除失败：" + e.message);
    }
  };

  /**
   * 点赞评论
   */
  const handleThumbComment = async (commentId: number) => {
    if (!isLoggedIn) {
      message.warning("请先登录");
      return;
    }

    try {
      await thumbCommentUsingPost({
        commentId: commentId,
      });
      message.success("操作成功");
      fetchComments(); // 重新获取评论列表
    } catch (e: any) {
      message.error("操作失败：" + e.message);
    }
  };

  /**
   * 回复评论
   */
  const handleReply = (commentId: number, userName: string) => {
    setReplyToId(commentId);
    setReplyToUser(userName);
    // 滚动到评论框
    const commentInput = document.getElementById('comment-input');
    if (commentInput) {
      commentInput.scrollIntoView({ behavior: 'smooth' });
      commentInput.focus();
    }
  };

  /**
   * 取消回复
   */
  const handleCancelReply = () => {
    setReplyToId(null);
    setReplyToUser(null);
  };

  // 渲染评论列表
  const renderComments = (commentList: API.CommentVO[]) => {
    // 构建评论树
    const commentMap = new Map<number, API.CommentVO & { children: API.CommentVO[] }>();
    const rootComments: (API.CommentVO & { children: API.CommentVO[] })[] = [];

    // 初始化所有评论，添加children数组
    commentList.forEach(comment => {
      commentMap.set(comment.id!, {
        ...comment,
        children: comment.children || []
      });
    });

    // 构建评论树
    commentList.forEach(comment => {
      if (comment.parentId) {
        // 如果有父评论，添加到父评论的children中
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.children.push(commentMap.get(comment.id!)!);
        } else {
          // 如果找不到父评论，作为根评论处理
          rootComments.push(commentMap.get(comment.id!)!);
        }
      } else {
        // 如果是根评论，添加到rootComments
        rootComments.push(commentMap.get(comment.id!)!);
      }
    });
    
    // 按时间排序
    rootComments.sort((a, b) => {
      return new Date(b.createTime!).getTime() - new Date(a.createTime!).getTime();
    });

    /**
     * 切换子评论显示状态
     */
    const toggleChildrenVisibility = (commentId: number) => {
      const newExpandedComments = new Set(expandedComments);
      if (newExpandedComments.has(commentId)) {
        newExpandedComments.delete(commentId);
      } else {
        newExpandedComments.add(commentId);
      }
      setExpandedComments(newExpandedComments);
    };

    return (
      <List
        className="comment-list"
        loading={loading}
        header={`${commentTotal} 条评论`}
        itemLayout="horizontal"
        dataSource={rootComments}
        renderItem={comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            loginUser={loginUser}
            isExpanded={expandedComments.has(comment.id!)}
            onToggleExpand={toggleChildrenVisibility}
            onReply={handleReply}
            onThumb={handleThumbComment}
            onDelete={handleDeleteComment}
          />
        )}
        pagination={{
          onChange: (page) => setCurrentPage(page),
          current: currentPage,
          pageSize: pageSize,
          total: commentTotal,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          }
        }}
      />
    );
  };

  return (
    <div className="comments-section">
      <Divider orientation="left">评论区</Divider>
      
      {/* 评论输入框 */}
      <div className="comment-input-container" style={{ marginBottom: 24 }}>
        {replyToUser && (
          <div style={{ marginBottom: 8 }}>
            <Text type="secondary">
              回复 @{replyToUser}{' '}
              <Button type="link" size="small" onClick={handleCancelReply}>
                取消回复
              </Button>
            </Text>
          </div>
        )}
        <TextArea
          id="comment-input"
          rows={4}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={isLoggedIn ? "写下你的评论..." : "请先登录后再评论"}
          disabled={!isLoggedIn}
          style={{ marginBottom: 8 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmitComment}
          disabled={!isLoggedIn || !commentContent.trim()}
        >
          发表评论
        </Button>
      </div>
      
      {/* 评论列表 */}
      {renderComments(comments)}
    </div>
  );
};

export default CommentSection;