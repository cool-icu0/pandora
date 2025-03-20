"use client";
import { message } from "antd";
import { getPostVoByIdUsingGet } from "@/api/postController";
import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import "./index.css";


/**
 * 帖子详情页
 * @constructor
 */
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
    <div id="postPage">
      <PostCard post={post} />
    </div>
  );
}