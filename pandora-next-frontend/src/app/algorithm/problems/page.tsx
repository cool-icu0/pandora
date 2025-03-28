'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Tag, Input, Select, Space, Table, message, Progress, Tooltip,Typography, Flex, Tabs, Avatar } from 'antd';
import { SearchOutlined, LikeFilled, StarFilled } from '@ant-design/icons';
import { listQuestionCodeVoByPageUsingPost } from '@/api/questionCodeController';
import { Pie } from '@ant-design/plots';
import { getQuestionCodeRankUsingGet } from '@/api/questionCodeController';
import './index.css';
import Link from 'next/link';
const { Paragraph } = Typography;

export default function AlgorithmPage() {
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<API.QuestionCodeVO[]>([]);
  const [total, setTotal] = useState(0);
  const [rankList, setRankList] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [currentType, setCurrentType] = useState('total');
  const [currentTimeType, setCurrentTimeType] = useState('year');
  const [pageSize, setPageSize] = useState(5);
  const [searchParams, setSearchParams] = useState({
    current: 1,
    pageSize: 20,
    searchText: '',
    tags: [] as string[],
  });

  // 添加获取排行榜数据的函数
  const fetchRankList = async (type: string, timeType?: string) => {
    try {
      const res = await getQuestionCodeRankUsingGet({
        year: type === 'time' ? (timeType === 'month' ? currentYear : selectedYear) : undefined,
        month: type === 'time' && timeType === 'month' ? selectedMonth : undefined,
        limit: pageSize,
      });
      setRankList((res as any).data ?? []);
    } catch (e:any) {
      message.error("获取排行榜失败，" + e.message);
    }
  };

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

  // 添加年份和月份选项
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}年`,
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}月`,
  }));

  const pageSizeOptions = [
    { value: 5, label: '显示5条' },
    { value: 10, label: '显示10条' },
    { value: 20, label: '显示20条' },
    { value: 50, label: '显示50条' },
  ];

  useEffect(() => {
    fetchProblems();
  }, [searchParams]);
  useEffect(() => {
    fetchRankList(currentType, currentTimeType);
  }, [currentType, currentTimeType, selectedYear, selectedMonth, pageSize]);


  // 添加排行榜头部组件
  const RankHeader = ({ type, timeType }: { type: string, timeType?: string }) => (
    <Flex justify="space-between" align="center" className="rank-header">
      <Select
        value={pageSize}
        options={pageSizeOptions}
        onChange={setPageSize}
        className="rank-select"
      />
      {type === 'time' && (
        <Select
          value={timeType === 'year' ? selectedYear : selectedMonth}
          options={timeType === 'year' ? yearOptions : monthOptions}
          onChange={(value) => {
            if (timeType === 'year') {
              setSelectedYear(value);
            } else {
              setSelectedMonth(value);
            }
          }}
          className="rank-select"
        />
      )}
    </Flex>
  );
  // 添加排行榜项组件
  const RankItem = ({ item, index }: { item: any, index: number }) => (
    <div className="rank-item">
      <span className="rank-index">{index + 1}.</span>
      <Link href={`/user/info/${item.id}`}>
      <Flex 
        align="center" 
        className="rank-container"
      >
        <Avatar src={item.userAvatar} className="rank-avatar" />
        <div className="rank-user">
          <Paragraph ellipsis className="rank-name">
            {item.userName}
          </Paragraph>
          <Paragraph ellipsis={{ rows: 1 }} type="secondary" className="rank-profile">
            {item.userProfile || '这个人很懒，什么都没写~'}
          </Paragraph>
        </div>
        <span className="rank-count">已通过：{item.questionPassCount} 题目</span>
      </Flex>
      </Link>
    </div>
  );
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
    <Flex gap="middle" className="p-6">
      <div style={{ flex: 1 }}>
        <Card>
          <div className="search-container">
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
          
          <div className="table-container">
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
          </div>
        </Card>
      </div>
      
      <Card title="刷题排行榜" className="rank-card">
        <Tabs
          defaultActiveKey="total"
          onChange={(key) => {
            setCurrentType(key);
            if (key === 'time') {
              setCurrentTimeType('year');
            }
          }}
          items={[
            {
              key: 'total',
              label: '总榜',
              children: (
                <>
                  <RankHeader type="total" />
                  <div>
                    {rankList.map((item: any, index) => (
                      <RankItem key={item.id} item={item} index={index} />
                    ))}
                  </div>
                </>
              ),
            },
            {
              key: 'time',
              label: '年月榜',
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Tabs
                    defaultActiveKey="year"
                    onChange={(key) => {
                      setCurrentTimeType(key);
                      fetchRankList('time', key);
                    }}
                    items={[
                      {
                        key: 'year',
                        label: '年榜',
                        children: (
                          <>
                            <RankHeader type="time" timeType="year" />
                            <div>
                              {rankList.map((item: any, index) => (
                                <RankItem key={item.id} item={item} index={index} />
                              ))}
                            </div>
                          </>
                        ),
                      },
                      {
                        key: 'month',
                        label: '月榜',
                        children: (
                          <>
                            <RankHeader type="time" timeType="month" />
                            <div>
                              {rankList.map((item: any, index) => (
                                <RankItem key={item.id} item={item} index={index} />
                              ))}
                            </div>
                          </>
                        ),
                      },
                    ]}
                  />
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </Flex>
  );
}