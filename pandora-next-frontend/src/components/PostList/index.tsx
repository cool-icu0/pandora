"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Button, Input, List, Space, Tag, Card, Typography } from "antd";
import { SearchOutlined, PlusOutlined, LikeOutlined, StarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { listPostVoByPageUsingPost } from "@/api/postController";
import dayjs from "dayjs";
import "./index.css";

const { Search } = Input;
const { Paragraph } = Typography;

interface Props {
  defaultPostList?: API.Post[];
  defaultTotal?: number;
  defaultSearchParams?: Record<string, any>;
}

/**
 * 帖子列表组件
 * @param props
 * @constructor
 */
const PostList: React.FC<Props> = (props) => {
  const { defaultPostList = [], defaultTotal = 0, defaultSearchParams = {} } = props;
  const [postList, setPostList] = useState<API.Post[]>(defaultPostList);
  const [total, setTotal] = useState<number>(defaultTotal);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<Record<string, any>>(defaultSearchParams);
  const router = useRouter();
  // 分页
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const pageSizeOptions = ['10', '20', '50', '100'];
  /**
   * 加载数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listPostVoByPageUsingPost({
        ...searchParams,
        current,
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      const posts = (res.data as any)?.records ?? [];
      setPostList(posts);
      setTotal((res.data as any)?.total ?? 0);
    } catch (e) {
      console.error("加载帖子列表失败", e);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * 搜索
   * @param value
   */
  const onSearch = (value: string) => {
    setSearchParams({
      ...searchParams,
      searchText: value,
    });
    setCurrent(1);
  };
  useEffect(() => {
    loadData();
  }, [current, pageSize, searchParams]);
  


  return (
    <div className="post-list">
      <Card className="post-list-container">
        <div className="post-list-header">
          <Search
            placeholder="搜索帖子"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={onSearch}
            style={{ width: 300 }}
            size="large"
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => router.push("/forum/create")}
            size="large"
          >
            发布帖子
          </Button>
        </div>
        <List
          itemLayout="vertical"
          size="large"
          loading={loading}
          pagination={{
            current,
            onChange: (page, pageSize) => {
              setCurrent(page);
              if (pageSize) setPageSize(pageSize);
            },
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            className: "post-pagination"
          }}
          dataSource={postList}
          renderItem={(item) => {
            // 解析标签
            let tagList: string[] = [];
            try {
              tagList = JSON.parse(item.tags || "[]");
            } catch (e) {
              console.error("解析标签失败", e);
            }
    
            return (
              
              <Card 
                className="post-item-card"
                hoverable
                onClick={() => router.push(`/forum/${item.id}`)}
              >
                <List.Item
                  key={item.id}
                  style={{ cursor: 'pointer', padding: 0, border: 'none' }}
                  actions={[
                    <span key="like" onClick={(e) => e.stopPropagation()}>
                      <LikeOutlined /> {item.thumbNum || 0}
                    </span>,
                    <span key="favorite" onClick={(e) => e.stopPropagation()}>
                      <StarOutlined /> {item.favourNum || 0}
                    </span>,
                    <span key="time" onClick={(e) => e.stopPropagation()}>
                      <ClockCircleOutlined /> {dayjs(item.createTime).format("YYYY-MM-DD HH:mm")}
                    </span>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        src={(item as any).user.userAvatar}
                      />
                    }
                    title={item.title}
                    description={
                      <Space size={[0, 8]} wrap>
                        {tagList.map((tag) => (
                          <Tag key={tag} color="blue">{tag}</Tag>
                        ))}
                      </Space>
                    }
                  />
                  <Paragraph className="post-content-preview" ellipsis={{ rows: 2 }}>
                    {item.content}
                  </Paragraph>
                </List.Item>
              </Card>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default PostList;