"use client";
import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Tag } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from "@/api/postController";
import { useRouter } from 'next/navigation';
import './index.css';

const { Title } = Typography;

/**
 * 推荐文章组件
 */
const RecommendedPosts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recommendedPosts, setRecommendedPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const res = await listPostVoByPageUsingPost({
          pageSize: 5,
          sortField: "thumbNum", // 按点赞数排序
          sortOrder: "descend",
        });
        setRecommendedPosts((res.data as any)?.records ?? []);
        // console.log("推荐文章数据:", (res.data as any)?.records);
      } catch (error) {
        console.error("获取推荐文章失败", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, []);

  const handlePostClick = (id: string) => {
    router.push(`/forum/${id}`);
  };

  return (
    <Card className="recommended-post-card">
      <Title level={4} className="recommended-post-title">
        <LikeOutlined style={{ color: '#1890ff', marginRight: 8 }} />
        帖子推荐
      </Title>
      {loading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={recommendedPosts}
          renderItem={(item) => (
            <List.Item 
              className="recommended-post-item"
              onClick={() => handlePostClick(item.id)}
            >
              <div className="recommended-post-name">{item.title}</div>
              <div className="recommended-post-tags">
                {item.tagList.map((tag: string, index: number) => (
                  tag && <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RecommendedPosts;