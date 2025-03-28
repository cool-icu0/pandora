'use client';

import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { Divider, Flex, message, Card, Space, Tabs, Tag, Avatar, Typography, Select } from "antd";
import Link from "next/link";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { getUserSignInRankUsingGet } from "@/api/userController";
import QuestionBankList from "@/components/QuestionBankList";
import QuestionList from "@/components/QuestionList";
import "./index.css";

const { Paragraph } = Typography;

export default function InterviewPage() {
  const [questionBankList, setQuestionBankList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [rankList, setRankList] = useState([]);
  
  // 获取当前年份
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [pageSize, setPageSize] = useState(10);

  // 添加当前选中类型的状态
  const [currentType, setCurrentType] = useState('total');
  const [currentTimeType, setCurrentTimeType] = useState('year');

  // 修改 fetchRankList 函数
  const fetchRankList = async (type: string, timeType?: string) => {
    try {
      const res = await getUserSignInRankUsingGet({
        year: type === 'time' ? (timeType === 'month' ? currentYear : selectedYear) : undefined,
        month: type === 'time' && timeType === 'month' ? selectedMonth : undefined,
        limit: pageSize,
      });
      setRankList((res as any).data ?? []);
    } catch (e:any) {
      message.error("获取排行榜失败，" + e.message);
    }
  };

  // 生成年份选项
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}年`,
  }));

  // 生成月份选项
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}月`,
  }));

  // 生成显示条数选项
  const pageSizeOptions = [
    { value: 5, label: '显示5条' },
    { value: 10, label: '显示10条' },
    { value: 20, label: '显示20条' },
    { value: 50, label: '显示50条' },
  ];
  // 添加监听状态变化的 useEffect
  useEffect(() => {
    fetchRankList(currentType, currentTimeType);
  }, [currentType, currentTimeType, selectedYear, selectedMonth, pageSize]);

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

  const RankItem = ({ item, index }: { item: any, index: number }) => {
    const getBorderColor = (role: string) => {
      switch (role) {
        case 'admin':
          return '#ff4d4f';
        case 'vip':
          return '#faad14';
        default:
          return '#1890ff';
      }
    };

    const getRoleName = (role: string) => {
      switch (role) {
        case 'admin':
          return '管理员';
        case 'vip':
          return '会员';
        case 'user':
          return '用户';
        default:
          return role;
      }
    };

    return (
      <div className="rank-item">
        <Tag 
          color={getBorderColor(item.userRole)}
          className="rank-tag"
        >
          {getRoleName(item.userRole)}
        </Tag>
        <Link href={`/user/info/${item.id}`}>
        <Flex 
          align="center" 
          className="rank-container"
          style={{ border: `1px solid ${getBorderColor(item.userRole)}` }}
        >
          <span className="rank-index">{index + 1}.</span>
          <Avatar src={item.userAvatar} className="rank-avatar" />
          <Flex vertical className="rank-user">
              <Paragraph ellipsis className="rank-name">
                  {item.userName}
              </Paragraph>
              <Paragraph ellipsis={{ rows: 1 }} type="secondary" className="rank-profile">
                  {item.userProfile || '这个人很懒，什么都没写~'}
              </Paragraph>
          </Flex>
          <span className="rank-count">{item.signInCount}天</span>
        </Flex>
        </Link>
      </div>
    );
  };

  useEffect(() => {
    // 初始化加载总榜数据
    fetchRankList('total');
    
    // 获取题库列表和题目列表
    listQuestionBankVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    })
      .then((res) => {
        setQuestionBankList((res.data as any)?.records ?? []);
      })
      .catch((e) => {
        message.error("获取题库列表失败，" + e.message);
      });

    listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    })
      .then((res) => {
        setQuestionList((res.data as any)?.records ?? []);
      })
      .catch((e) => {
        message.error("获取题目列表失败，" + e.message);
      });
  }, []);

  return (
    <Flex gap="middle">
      <div id="Interview" className="max-width-content" style={{ flex: 1 }}>
        <Flex justify="space-between" align="center">
          <Title level={3}>最新题库</Title>
          <Link href={"/interview/banks"}>查看更多</Link>
        </Flex>
        <QuestionBankList questionBankList={questionBankList} />
        <Divider />
        <Flex justify="space-between" align="center">
          <Title level={3}>最新题目</Title>
          <Link href={"/interview/questions"}>查看更多</Link>
        </Flex>
        <QuestionList questionList={questionList} />
      </div>
      
      <Card title="坚持力排行榜" style={{ width: 300 }}>
        <Tabs
          defaultActiveKey="year"
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
                    defaultActiveKey="total"
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
