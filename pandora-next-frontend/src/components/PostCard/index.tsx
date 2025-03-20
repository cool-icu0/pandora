"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Divider, message, Space, Tag, Typography, Popconfirm } from "antd";
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled, DeleteOutlined, EditOutlined, CommentOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { doThumbUsingPost } from "@/api/postThumbController";
import { doPostFavourUsingPost } from "@/api/postFavourController";
import { deletePostUsingPost } from "@/api/postController";
import dayjs from "dayjs";
import MdViewer from "@/components/MdViewer";
import CommentSection from "@/components/CommentSection";
import "./index.css";
import { listCommentByPageUsingPost } from "@/api/commentController";

const { Title } = Typography;

interface Props {
  post: API.BaseResponsePostVO_;
}

/**
 * 帖子详情卡片组件
 * @param props
 * @constructor
 */
const PostCard: React.FC<Props> = (props) => {
  const { post } = props;
  const card = (post as any);
  const loginUser = useSelector((state: RootState) => state.loginUser);
  
  // 判断用户是否已登录
  const isLoggedIn = !!(loginUser && loginUser.id);
  
  // 点赞和收藏状态
  const [liked, setLiked] = useState<boolean>(card.hasThumb || 0);
  const [favorited, setFavorited] = useState<boolean>(card.hasFavour|| 0);
  const [favourNum, setFavourNum] = useState<number>(card.favourNum || 0);
  const [thumbNum, setThumbNum] = useState<number>(card.thumbNum || 0);

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState<boolean>(false);
  
  // 评论相关状态
  const [commentTotal, setCommentTotal] = useState<number>(card.commentCount || 0);
  const [showComments, setShowComments] = useState<boolean>(true);//todo 需要设置成false
  
  // 解析标签
  let tagList: string[] = [];
  try {
    tagList = card.tagList;
  } catch (e) {
    console.error("解析标签失败", e);
  }

  /**
   * 点赞
   */
  const handleLike = async () => {
    if (!loginUser || !loginUser.id) {
      message.warning("请先登录");
      return;
    }
  
    try {
      setIsLikeAnimating(true);
      await doThumbUsingPost({
        postId: card.id,
      });
      setLiked(!liked);
      setThumbNum(liked ? thumbNum - 1 : thumbNum + 1);
      message.success(liked ? "已取消点赞" : "点赞成功");
      // 动画结束后重置状态
      setTimeout(() => {
        setIsLikeAnimating(false);
      }, 1000);
    } catch (e:any) {
      setIsLikeAnimating(false);
      message.error("操作失败，" + e.message);
    }
  };
  /**
   * 收藏
   */
  const handleFavorite = async () => {
    if (!loginUser || !loginUser.id) {
      message.warning("请先登录");
      return;
    }
  
    try {
      setIsAnimating(true);
      await doPostFavourUsingPost({
        postId: card.id,
      });
      setFavorited(!favorited);
      setFavourNum(favorited ? favourNum - 1 : favourNum + 1);
      message.success(favorited ? "已取消收藏" : "收藏成功");
      
      // 动画结束后重置状态
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    } catch (e:any) {
      setIsAnimating(false);
      message.error("操作失败，" + e.message);
    }
  };
  /**
   * 删除帖子
   */
  const handleDelete = async () => {
    if (!loginUser || !loginUser.id) {
      message.warning("请先登录");
      return;
    }
  
    try {
      await deletePostUsingPost({
        id: card.id,
      });
      message.success("删除成功");
      // 可以在这里添加删除后的跳转逻辑，例如跳转到帖子列表页
      window.location.href = "/forum";
    } catch (e:any) {
      message.error("删除失败，" + e.message);
    }
  };
  /**
   * 跳转到编辑页面
   */
  const handleEdit = () => {
    if (!loginUser || !loginUser.id) {
      message.warning("请先登录");
      return;
    }
    // 将帖子信息编码后作为查询参数传递
    const postInfo = {
      id: card.id,
      title: card.title,
      content: card.content,
      tagList: card.tagList,
    };
    const queryParams = new URLSearchParams({
      postInfo: JSON.stringify(postInfo)
    }).toString();
    
    // 跳转到编辑页面
    window.location.href = `/forum/edit/${card.id}?${queryParams}`;
  };
  // 判断当前用户是否为帖子作者或管理员
  const canEdit = loginUser && (loginUser.id === card.userId || loginUser.userRole === 'admin');
  const canDelete = loginUser && (loginUser.id === card.userId || loginUser.userRole === 'admin');


  /**
   * 获取评论数量（无需显示评论区）
   */
  const fetchCommentCount = async () => {
    try {
      const res = await listCommentByPageUsingPost({
        postId: card.id,
        current: 1,
        pageSize: 1, // 只需要获取总数，所以pageSize设为1即可
        sortField: 'createTime',
        sortOrder: 'descend',
      });
      
      if (res.data) {
        setCommentTotal((res.data as any)?.total || 0);
      }
    } catch (e: any) {
      console.error("获取评论数量失败：", e);
    }
  };

  // 组件挂载时获取评论数量
  useEffect(() => {
    if (card.id) {
      fetchCommentCount();
    }
  }, [card.id]);

  return (
    <div className="post-card">
      <Card
        extra={
          <Space>
            {canEdit && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                修改
              </Button>
            )}
            {canDelete && (
              <Popconfirm
                title="确定要删除这篇帖子吗？"
                onConfirm={handleDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        }
      >
        <Title level={2}>{card.title}</Title>
        <div className="post-meta">
          <Space>
            <Avatar src={card.user.userAvatar} />
            <span>{card.user.userName || "匿名用户"}</span>
            <span>{dayjs(card.createTime).format("YYYY-MM-DD HH:mm")}</span>
          </Space>
        </div>
        <Divider />
        <div className="post-content">
          <MdViewer value={card.content || ""} />
        </div>
        <Space size={[0, 8]} wrap>
            {tagList.map((tag) => (
              <Tag color="blue" key={tag}>{tag}</Tag>
            ))}
        </Space>
        <Divider />
        <div className="post-actions">
          <Button
            type="text"
            className={`like-button ${isLikeAnimating ? 'animating' : ''} ${liked ? 'liked' : ''} ${!isLoggedIn ? 'disabled-action' : ''}`}
            icon={liked ? <LikeFilled /> : <LikeOutlined />}
            onClick={handleLike}
            disabled={!isLoggedIn}
          >
            {liked ? "已点赞" : "点赞"} ({thumbNum})
          </Button>
          <Button
            type="text"
            className={`favorite-button ${isAnimating ? 'animating' : ''} ${favorited ? 'favorited' : ''} ${!isLoggedIn ? 'disabled-action' : ''}`}
            icon={favorited ? <StarFilled /> : <StarOutlined />}
            onClick={handleFavorite}
            disabled={!isLoggedIn}
          >
            {favorited ? "已收藏" : "收藏"} ({favourNum})
          </Button>
          <Button
            type="text"
            icon={<CommentOutlined />}
            onClick={() => setShowComments(!showComments)}
          >
            评论 ({commentTotal})
          </Button>
        </div>
        
        {showComments && (
          <CommentSection 
            postId={card.id}
            loginUser={loginUser}
            isLoggedIn={isLoggedIn}
            onCommentCountChange={setCommentTotal}
          />
        )}
      </Card>
    </div>
  );
};

export default PostCard;