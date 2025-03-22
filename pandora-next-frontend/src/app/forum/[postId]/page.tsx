"use client";
import { message, Card, Avatar } from "antd";
import { getPostVoByIdUsingGet } from "@/api/postController";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import "./index.css";

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await getPostVoByIdUsingGet({
          id: params.postId,
        });
        setPost(res.data as any);
        setLoading(false);
      } catch (e:any) {
        message.error("获取帖子详情失败，" + e.message);
        setError(true);
        setLoading(false);
      }
    };

    fetchPostData();
  }, [params.postId]);
  
  // 加载中状态
  if (loading) {
    return <div>加载中...</div>;
  }

  // 错误处理
  if (error || !post) {
    return <div>获取帖子详情失败，请刷新重试</div>;
  }

  return (
    <div className="post-page-container">
      <div className="post-main-content">
        <PostCard post={post} />
      </div>
      <div className="user-info-sidebar">
        <Card className="user-info-card">
          <div className="user-info-header">
            <Avatar size={64} src={post.user.userAvatar} />
            <h3 className="username">{post.user.userName}</h3>
          </div>
          <div className="user-info-content">
            <p className="user-profile">{post.user.userProfile || '这个用户很懒，还没有简介'}</p>
            <div className="user-role">
              <span className="role-tag">{post.user.userRole}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}