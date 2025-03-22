'use client';

// 修改导入部分
import { useEffect, useState, useRef } from 'react';
import { Card, Tag, Input, Select, Space, Table, message, Progress, Tooltip } from 'antd';
import { SearchOutlined, LikeFilled, StarFilled } from '@ant-design/icons';
import { listQuestionCodeVoByPageUsingPost } from '@/api/questionCodeController';
import { Pie } from '@ant-design/plots';

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
      width: 250,
      render: (title: string, record: API.QuestionCodeVO) => (
        <a href={`/algorithm/problem/${record.id}`}>{title}</a>
      )
    },
    {
      title: '通过率',
      key: 'acceptance',
      width: 250,
      render: (_: any, record: API.QuestionCodeVO) => {
        const acceptanceRate = (((record.acceptedNum || 0) / (record.submitNum || 1)) * 100);
        const acceptedNum = record.acceptedNum || 0;
        const totalSubmit = record.submitNum || 0;
        let strokeColor = '';
        
        if (acceptanceRate <= 30) {
          strokeColor = '#ff4d4f';
        } else if (acceptanceRate <= 50) {
          strokeColor = '#ff7875';
        } else if (acceptanceRate <= 70) {
          strokeColor = '#ffa940';
        } else if (acceptanceRate <= 85) {
          strokeColor = '#52c41a';
        } else {
          strokeColor = '#52c41a';
        }

        const tooltipContent = (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '8px' }}>
              通过数：{acceptedNum}<br />
              提交数：{totalSubmit}
            </div>
            <DonutChart 
              data={
                acceptedNum === 0 && totalSubmit === 0 
                  ? [{ type: '未开始', value: 1 }]
                  : [
                      { type: '通过', value: acceptedNum },
                      { type: '未通过', value: totalSubmit - acceptedNum }
                    ]
              }
              color={
                acceptedNum === 0 && totalSubmit === 0 
                  ? ['#f0f0f0']
                  : [strokeColor, '#f0f0f0']
              }
            />
          </div>
        );

// 替换原来的 DonutChart 组件
function DonutChart({ data, color }: { data: { type: string; value: number }[]; color: string[] }) {
  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    legend: false,
    innerRadius: 0.6,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
    style: {
      stroke: '#fff',
      lineWidth: 1,
    },
    width: 100,
    height: 100,
    autoFit: false,
    padding: 0,
    scale: {
      color: {
        range: color,
      },
    },
  };

  return <Pie {...config} />;
}

        return (
          <Tooltip title={tooltipContent} color='white' overlayInnerStyle={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            <div style={{ width: '200px', padding: '4px 0' }}>
              <Progress
                percent={Number(acceptanceRate.toFixed(2))}
                size={[200, 20]}
                strokeColor={strokeColor}
                trailColor="#f0f0f0"
                format={(percent) => (
                  <span style={{ 
                    color: 'black',
                    fontSize: '12px',
                    textShadow: '0 0 2px rgba(0,0,0,0.5)',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    {percent}%
                  </span>
                )}
                style={{
                  margin: 0,
                  width: '200px',
                  position: 'relative'
                }}
                strokeLinecap="round"
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '难度',
      key: 'difficulty',
      render: (_: any, record: API.QuestionCodeVO) => {
        let color = '';
        
        if ((record as any).difficulty === '极难') {
          color = '#f50';
        } else if ((record as any).difficulty === '困难') {
          color = '#ff4d4f';
        } else if ((record as any).difficulty === '中等') {
          color = '#faad14';
        } else if ((record as any).difficulty === '初级') {
          color = '#1890ff';
        } else {
          color = '#52c41a';
        }

        return (
          <Tag color={color}>
            {(record as any).difficulty}
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