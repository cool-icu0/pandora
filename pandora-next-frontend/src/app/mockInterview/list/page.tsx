"use client";
import { useEffect, useState } from "react";
import { Card, List, Tag, Space, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { listMockInterviewVoByPageUsingPost} from "@/api/mockInterviewController";
import "./index.css";
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

export default function MockInterviewListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState<API.MockInterview[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });

  const loadInterviews = async (page = 1, pageSize = 8) => {
    setLoading(true);
    try {
      const res = await listMockInterviewVoByPageUsingPost({
        current: page,
        pageSize: pageSize,
      });
      if (res.data) {
        setInterviews(res.data.records || []);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: res.data.total || 0,
        });
      }
    } catch (error) {
      message.error("获取面试列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handlePageChange = (page: number, pageSize?: number) => {
    loadInterviews(page, pageSize);
  };

  const getStatusTag = (status: number) => {
    const statusMap = {
      0: { color: "warning", text: "未开始",icon:<ClockCircleOutlined /> },
      1: { color: "success", text: "进行中",icon:<SyncOutlined spin/>  },
      2: { color: "#f50", text: "已结束",icon:<CloseCircleOutlined /> },
    };
    return statusMap[status] || statusMap[0];
  };

  const handleStartInterview = (id: string) => {
    router.push(`/mockInterview/chat/${id}`);
  };

  return (
    <div className="mock-interview-list">
      <div className="header">
        <h1>模拟面试列表</h1>
      </div>
      <div className="list-container">
        <List
          loading={loading}
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          dataSource={interviews}
          pagination={{
            ...pagination,
            onChange: handlePageChange,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 场面试`,
          }}
          renderItem={(item) => (
            <List.Item>
              <Card 
                hoverable 
                className="interview-card"
              >
                <h3 className="interview-title">模拟面试第{item.id}场</h3>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <Space>
                    <ClockCircleOutlined />
                    {item.workExperience || 0} 年经验
                  </Space>
                  <Space>
                        <UserOutlined />
                        技术级别: {item.difficulty}
                  </Space>
                  <Space>
                        <ExclamationCircleOutlined />
                        岗位: {item.jobPosition}
                  </Space>
                  <div>
                    <Tag color={getStatusTag(item.status).color} icon={getStatusTag(item.status).icon}>
                      {getStatusTag(item.status).text}
                    </Tag>
                  </div>
                  <Button
                    type="primary"
                    onClick={() => handleStartInterview(item.id)}
                    block
                  >
                    进入面试
                  </Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}