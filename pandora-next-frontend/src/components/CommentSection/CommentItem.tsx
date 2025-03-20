import React from "react";
import { Avatar, Space, Typography, Popconfirm } from "antd";
import { LikeOutlined, LikeFilled, CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

interface CommentItemProps {
  comment: API.CommentVO & { children: API.CommentVO[] };
  loginUser: any;
  isExpanded: boolean;
  onToggleExpand: (commentId: number) => void;
  onReply: (commentId: number, userName: string) => void;
  onThumb: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  level?: number; // 添加层级属性
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  loginUser,
  isExpanded,
  onToggleExpand,
  onReply,
  onThumb,
  onDelete,
  level = comment.level // 默认为1级（顶层评论）
}) => {
  const isCommentOwner = loginUser && loginUser.id === comment.userId;
  const isAdmin = loginUser && loginUser.userRole === 'admin';
  const canDeleteComment = isCommentOwner || isAdmin;
  const hasChildren = comment.children && comment.children.length > 0;

  // 根据层级设置不同的样式
  const getLevelStyle = () => {
    // 基础样式
    const baseStyle = {
      marginBottom: 16,
      padding: 12,
      borderRadius: 4,
    };
    
    // 根据层级添加特定样式
    if (level === 1) { // 一级评论
      return {
        ...baseStyle,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      };
    } else if (level === 2) { // 二级评论
      return {
        ...baseStyle,
        backgroundColor: 'rgba(24, 144, 255, 0.05)',
        borderLeft: '3px solid #1890ff',
      };
    } else { // 三级及以上评论
      return {
        ...baseStyle,
        backgroundColor: 'rgba(82, 196, 26, 0.05)',
        borderLeft: '3px solid #52c41a',
      };
    }
  };

  // 获取层级对应的边框颜色
  const getBorderColor = () => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
    return colors[((level || 1) - 1) % colors.length];
  };

  return (
    <div className="comment-item" style={getLevelStyle()}>
      <div className="comment-header" style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={comment.userVO?.userAvatar} />
        <div style={{ marginLeft: 8 }}>
          <Text strong>{comment.userVO?.userName || '匿名用户'}</Text>
          {level && level > 1 && (
            <Text style={{ 
              marginLeft: 8, 
              fontSize: '12px',
              padding: '1px 6px',
              backgroundColor: level === 2 ? 'rgba(24, 144, 255, 0.1)' : 'rgba(82, 196, 26, 0.1)',
              borderRadius: '10px',
              color: level === 2 ? '#1890ff' : '#52c41a'
            }}>
              {`${level}级评论`}
            </Text>
          )}
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {dayjs(comment.createTime).format('YYYY-MM-DD HH:mm')}
          </Text>
        </div>
      </div>
      <div className="comment-content" style={{ marginLeft: 40, marginTop: 8 }}>
        {comment.parentId && comment.replyUserVO && (
          <Text type="secondary" style={{ marginRight: 8 }}>
            回复 @{comment.replyUserVO.userName}:
          </Text>
        )}
        <div>{comment.content}</div>
      </div>
      <div className="comment-actions" style={{ marginLeft: 40, marginTop: 8 }}>
        <Space>
          <span 
            className="comment-action" 
            onClick={() => onThumb(comment.id!)}
            style={{ cursor: 'pointer' }}
          >
            {comment.hasThumb ? <LikeFilled style={{ color: '#1890ff' }} /> : <LikeOutlined />} {comment.thumbNum || 0}
          </span>
          <span 
            className="comment-action" 
            onClick={() => onReply(comment.id!, comment.userVO?.userName || '匿名用户')}
            style={{ cursor: 'pointer' }}
          >
            <CommentOutlined /> 回复
          </span>
          <span 
            className="comment-action" 
            onClick={() => onToggleExpand(comment.id!)}
            style={{ cursor: 'pointer' }}
          >
            {isExpanded ? 
              <span style={{ color: '#1890ff' }}>收起回复 ({hasChildren ? comment.children.length : 0})</span> : 
              <span>查看回复 ({hasChildren ? comment.children.length : 0})</span>
            }
          </span>
          {canDeleteComment && (
            <Popconfirm
              title="确定要删除这条评论吗？"
              onConfirm={() => onDelete(comment.id!)}
              okText="确定"
              cancelText="取消"
            >
              <span className="comment-action" style={{ cursor: 'pointer' }}>
                <DeleteOutlined /> 删除
              </span>
            </Popconfirm>
          )}
        </Space>
      </div>
      
      {/* 子评论列表 */}
      {hasChildren && isExpanded && (
        <div className="comment-children" style={{ 
          marginLeft: 40, 
          marginTop: 16, 
          borderLeft: `2px solid ${getBorderColor()}`, 
          paddingLeft: 16 
        }}>
          {comment.children.map(child => (
            <CommentItem
              key={child.id}
              comment={{...child, children: []}}
              loginUser={loginUser}
              isExpanded={false}
              onToggleExpand={onToggleExpand}
              onReply={onReply}
              onThumb={onThumb}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;