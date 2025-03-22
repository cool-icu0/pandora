"use client";
import { message } from "antd";
import Title from "antd/es/typography/Title";
import { listPostVoByPageUsingPost } from "@/api/postController";
import PostList from "@/components/PostList";
import HotPostList from "@/components/HotPostList";
import RecommendedPosts from "@/components/RecommendedPosts";
import "./index.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 论坛首页
 */
export default function ForumPage() {
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q") ?? undefined;
  const [postList, setPostList] = useState([]);
  const [total, setTotal] = useState(0);

  const loadData = async () => {
    try {
      const res = await listPostVoByPageUsingPost({
        searchText,
        pageSize: 10,
        sortField: "createTime",
        sortOrder: "descend",
      });
      setPostList((res.data as any)?.records ?? []);
      setTotal((res.data as any)?.total ?? 0);
    } catch (e: any) {
      message.error("获取帖子列表失败，" + e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchText]);

  return (
    <div id="forumPage">
      <div className="forum-header">
        <Title level={2} className="forum-title">论坛讨论</Title>
        <div className="forum-description">分享你的知识，解答他人的疑惑</div>
      </div>
      <div className="forum-content-layout">
        <div className="forum-main-content">
          <PostList 
            defaultPostList={postList}
            defaultTotal={total}
            defaultSearchParams={{
              title: searchText,
            }}
          />
        </div>
        <div className="forum-side-content">
          <HotPostList />
          <RecommendedPosts />
        </div>
      </div>
    </div>
  );
}