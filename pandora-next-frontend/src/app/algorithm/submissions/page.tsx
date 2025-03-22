'use client';

import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Typography, Space, Button, Spin, Tooltip, Modal } from 'antd';
import { listQuestionCodeSubmitByPageUsingPost } from '@/api/questionCodeController';
import { useRouter } from 'next/navigation';
import { CheckCircleOutlined, CloseCircleOutlined, CodeOutlined, EyeOutlined } from '@ant-design/icons';
import CodeEditor from '@/components/CodeEditor';
import './index.css';

const { Title, Text } = Typography;

export default function SubmissionsPage() {
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  
  const router = useRouter();

  const fetchSubmissions = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const res = await listQuestionCodeSubmitByPageUsingPost({
        current: page,
        pageSize,
      });
      
      if ((res as any).code === 0 && (res as any).data) {
        const { records, total } = (res as any).data;
        setSubmissions(records || []);
        setPagination({
          ...pagination,
          current: page,
          total,
        });
      }
    } catch (error) {
      console.error('获取提交记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchSubmissions(pagination.current, pagination.pageSize);
  };

  const handleViewCode = (record: any) => {
    setSelectedSubmission(record);
    console.log("ces",record);
    setCodeModalVisible(true);
  };

  const handleViewProblem = (questionId: string) => {
    router.push(`/algorithm/problem/${questionId}`);
  };

  const getStatusTag = (status: string) => {
    if (status === '成功') {
      return <Tag icon={<CheckCircleOutlined />} color="success">通过</Tag>;
    } else if (status === '答案错误') {
      return <Tag icon={<CloseCircleOutlined />} color="error">答案错误</Tag>;
    } else if (status === 'Time Limit Exceeded') {
      return <Tag color="warning">超时</Tag>;
    } else if (status === 'Memory Limit Exceeded') {
      return <Tag color="warning">内存超限</Tag>;
    } else if (status === 'Runtime Error') {
      return <Tag color="error">运行错误</Tag>;
    } else if (status === 'Compile Error') {
      return <Tag color="error">编译错误</Tag>;
    } else {
      return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: '题目',
      dataIndex: 'questionId',
      key: 'questionId',
      render: (text: string, record: any) => (
        <a onClick={() => handleViewProblem(record.questionId)}>{text}</a>
      ),
    },
    {
      title: '状态',
      dataIndex: 'judgeInfo',
      key: 'judgeInfo',
      render: (judgeInfo:any) => getStatusTag(judgeInfo.message),
    },
    {
      title: '执行用时',
      dataIndex: 'judgeInfo',
      key: 'judgeInfo',
      render: (judgeInfo:any) => `${judgeInfo.time} ms`,
    },
    {
      title: '内存消耗',
      dataIndex: 'judgeInfo',
      key: 'judgeInfo',
      render: (judgeInfo:any) => `${judgeInfo.memory} KB`,
    },
    {
      title: '语言',
      dataIndex: 'submitLanguage',
      key: 'submitLanguage',
      render: (lang: string) => {
        const langMap: Record<string, string> = {
          java: 'Java',
          python: 'Python',
          cpp: 'C++',
          javascript: 'JavaScript',
        };
        return langMap[lang] || lang;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '查看代码',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看代码">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewCode(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="submissions-page" style={{ padding: '24px', background: '#f7f9fc' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="page-header">
          <Title level={2}>我的提交记录</Title>
          <Text type="secondary">查看您的算法题目提交历史和结果</Text>
        </div>

        <Card bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={submissions}
              rowKey="id"
              pagination={pagination}
              onChange={handleTableChange}
              locale={{ emptyText: '暂无提交记录' }}
            />
          </Spin>
        </Card>
      </Space>

      <Modal
        title={
          <Space>
            <CodeOutlined />
            <span>
              {selectedSubmission?.questionTitle} - 
              {selectedSubmission?.submitLanguage === 'java' ? 'Java' : 
               selectedSubmission?.submitLanguage === 'python' ? 'Python' : 
               selectedSubmission?.submitLanguage}
            </span>
          </Space>
        }
        open={codeModalVisible}
        onCancel={() => setCodeModalVisible(false)}
        footer={null}
        width={800}
        centered
      >
        <div style={{ marginBottom: '16px' }}>
          <Space>
            {selectedSubmission && getStatusTag(selectedSubmission.status)}
            <Text>执行用时: {selectedSubmission?.judgeInfo.time} ms</Text>
            <Text>内存消耗: {selectedSubmission?.judgeInfo.memory} KB</Text>
          </Space>
        </div>
        <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
          {selectedSubmission && (
            <CodeEditor
              value={selectedSubmission.submitCode || ''}
              language={selectedSubmission.submitLanguage}
              readOnly={true}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}