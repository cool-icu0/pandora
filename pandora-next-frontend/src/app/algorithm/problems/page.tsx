'use client';

import { useEffect, useState } from 'react';
import { Card, Tag, Input, Select, Space, Table, message } from 'antd';
import { SearchOutlined, LikeFilled, StarFilled } from '@ant-design/icons';
import { listQuestionCodeVoByPageUsingPost } from '@/api/questionCodeController';

export default function AlgorithmPage() {
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<API.QuestionCodeVO[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({
    current: 1,
    pageSize: 20,
    searchText: '',
    tags: [] as string[],
  });

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await listQuestionCodeVoByPageUsingPost({
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        title: searchParams.searchText,
        tags: searchParams.tags.length > 0 ? searchParams.tags : undefined,
      });
      
      if ((res as any)?.code === 0 && res.data) {
        setProblems((res.data as any).records || []);
        setTotal((res.data as any).total || 0);
      } else {
        message.error('获取题目列表失败');
      }
    } catch (error) {
      message.error('获取题目列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [searchParams]);

  const columns = [
    {
      title: '状态',
      key: 'status',
      render: (_: any, record: API.QuestionCodeVO) => (
        <span>{(record.submitNum ?? 0) > 0 ? '✅' : ''}</span>
      ),
      width: 60
    },
    {
      title: '题目',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: API.QuestionCodeVO) => (
        <a href={`/algorithm/problem/${record.id}`}>{title}</a>
      )
    },
    {
      title: '通过率',
      key: 'acceptance',
      render: (_: any, record: API.QuestionCodeVO) => {
        const acceptanceRate = (((record.acceptedNum || 0) / (record.submitNum || 1)) * 100);
        let color = '';
        let level = '';
        
        if (acceptanceRate <= 30) {
          color = '#f50';
          level = '极难';
        } else if (acceptanceRate <= 50) {
          color = '#ff4d4f';
          level = '困难';
        } else if (acceptanceRate <= 70) {
          color = '#faad14';
          level = '中等';
        } else if (acceptanceRate <= 85) {
          color = '#1890ff';
          level = '初级';
        } else {
          color = '#52c41a';
          level = '简单';
        }

        return (
          <Tag color={color}>
            {acceptanceRate.toFixed(1)}% · {level}
          </Tag>
        );
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {(tags || []).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    },
    {
      title: '点赞/收藏',
      key: 'interactions',
      width: 120,
      render: (_: any, record: API.QuestionCodeVO) => (
        <Space className="text-gray-400">
          <Space>
            <LikeFilled /> {record.thumbNum || 0}
          </Space>
          <Space>
            <StarFilled /> {record.favourNum || 0}
          </Space>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="mb-4">
          <Space size="large">
            <Input
              placeholder="搜索题目"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onChange={(e) => {
                setSearchParams(prev => ({
                  ...prev,
                  searchText: e.target.value,
                  current: 1,
                }));
              }}
            />
            <Select
              placeholder="标签"
              mode="tags"
              style={{ width: 200 }}
              onChange={(values) => {
                setSearchParams(prev => ({
                  ...prev,
                  tags: values,
                  current: 1
                }));
              }}
              options={[
                { value: '数组', label: '数组' },
                { value: '字符串', label: '字符串' },
                { value: '哈希表', label: '哈希表' },
                { value: '动态规划', label: '动态规划' }
              ]}
              tokenSeparators={[',']}
              allowClear
            />
          </Space>
        </div>
        
        <Table
          loading={loading}
          columns={columns}
          dataSource={problems}
          rowKey="id"
          pagination={{
            total,
            current: searchParams.current,
            pageSize: searchParams.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setSearchParams(prev => ({
                ...prev,
                current: page,
                pageSize
              }));
            }
          }}
        />
      </Card>
    </div>
  );
}