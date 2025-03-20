"use server";
import { message } from "antd";
import Title from "antd/es/typography/Title";
import { listPostVoByPageUsingPost } from "@/api/postController";
import PostList from "@/components/PostList";
import HotPostList from "@/components/HotPostList";
import RecommendedPosts from "@/components/RecommendedPosts";
import "./index.css";

/**
 * 论坛首页
 * @constructor
 */
export default async function ForumPage({ searchParams }: { searchParams: { q?: string } }) {
  // 获取 url 的查询参数
  const { q: searchText } = searchParams;
  // 帖子列表和总数
  let postList = [];
  let total = 0;

  try {
    const res = await listPostVoByPageUsingPost({
      searchText,
      pageSize: 10,
      sortField: "createTime",
      sortOrder: "descend",
    });
    postList = (res.data as any)?.records ?? [];
    total = (res.data as any)?.total ?? 0;
  } catch (e:any) {
    message.error("获取帖子列表失败，" + e.message);
  }
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