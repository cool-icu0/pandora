"use client";
import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from "@/api/postController";
import { useRouter } from 'next/navigation';
import './index.css';

const { Title } = Typography;

/**
 * 热门文章榜单组件
 */
const HotPostList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hotPosts, setHotPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const res = await listPostVoByPageUsingPost({
          pageSize: 5,
          sortField: "favourNum", // 按浏览量排序
          sortOrder: "descend",
        });
        setHotPosts((res.data as any)?.records ?? []);
      } catch (error) {
        console.error("获取热门文章失败", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotPosts();
  }, []);

  const handlePostClick = (id: string) => {
    router.push(`/forum/${id}`);
  };

  return (
    <Card className="hot-post-card">
      <Title level={4} className="hot-post-title">
        <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
        热门帖子榜
      </Title>
      {loading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          dataSource={hotPosts}
          renderItem={(item, index) => (
            <List.Item 
              className="hot-post-item"
              onClick={() => handlePostClick(item.id)}
            >
              <div className="flex items-center">
                <div className="hot-post-rank mr-3">{index + 1}</div>
                <div className="hot-post-content flex-1">
                  <div className="flex justify-between items-center">
                    <div className="hot-post-name">{item.title}</div>
                    <div className="hot-post-views flex items-center">
                      <FireOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                      <span>{item.favourNum}</span>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default HotPostList;