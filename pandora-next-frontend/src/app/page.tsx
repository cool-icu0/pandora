"use client";

import Title from "antd/es/typography/Title";
import { Divider, Flex, message, Card, Calendar, Badge, Statistic, Row, Col, Spin } from "antd";
import Link from "next/link";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import { listQuestionCodeVoByPageUsingPost } from '@/api/questionCodeController';
import { addUserSignInUsingPost, getUserSignInRecordUsingGet } from '@/api/userController'; // 添加获取打卡记录接口
import QuestionBankList from "@/components/QuestionBankList";
import QuestionList from "@/components/QuestionList";
import "./index.css";
import type { Dayjs } from 'dayjs';
import { useState, useEffect } from "react";
import { Table, Tag } from "antd";

/**
 * 主页
 * @constructor
 */
export default function HomePage() {
  const [questionBankList, setQuestionBankList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [algorithmList, setAlgorithmList] = useState<API.QuestionCodeVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [algorithmPagination, setAlgorithmPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0
  });
  // 面试题目分页状态
  const [questionPagination, setQuestionPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0
  });
  // 添加面试题库分页状态
  const [bankPagination, setBankPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0
  });
  
  // 添加打卡数据状态
  const [checkInData, setCheckInData] = useState({
    currentMonth: 0, // 本月已打卡天数
    total: 0, // 总打卡天数
    streak: 0, // 连续打卡天数
    records: [] as number[] // 打卡记录
  });
  
  // 获取打卡记录
  const fetchSignInData = async () => {
    try {
      const res = await getUserSignInRecordUsingGet({
        year: new Date().getFullYear(),
      });
      if ((res as any)?.code === 0 && res.data) {
        // 接口返回的是整数数组，表示一年中的哪几天有打卡记录
        const signInDays = (res.data as any) || [];
        
        // 计算各项统计数据
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        
        // 获取当前月份的天数
        const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
        
        // 计算本月第一天是一年中的第几天
        const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const dayOfYear = Math.floor((firstDayOfMonth.getTime() - new Date(currentYear, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1;
        
        // 计算本月打卡天数
        const currentMonthDays = signInDays.filter(day => day >= dayOfYear && day < dayOfYear + daysInMonth);
        const currentMonthCount = currentMonthDays.length;
        // console.log(signInDays,"测试：",currentMonthCount);
        // 计算总打卡天数
        const totalCount = signInDays.length;
        
        // 计算连续打卡天数
        let streakCount = 0;
        // 按日期排序（从大到小）
        const sortedDays = [...signInDays].sort((a, b) => b - a);
        
        if (sortedDays.length > 0) {
          // 获取今天是一年中的第几天
          const today = new Date();
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          const todayDayOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
          
          // 检查最新的打卡日期是否是今天或昨天
          const latestDay = sortedDays[0];
          const diffDays = todayDayOfYear - latestDay;
          
          // 如果最新打卡不是今天或昨天，连续打卡中断
          if (diffDays > 1) {
            streakCount = 0;
          } else {
            streakCount = 1; // 至少有一天
            // 计算连续天数
            for (let i = 1; i < sortedDays.length; i++) {
              const currentDay = sortedDays[i-1];
              const prevDay = sortedDays[i];
              
              if (currentDay - prevDay === 1) {
                streakCount++;
              } else {
                break;
              }
            }
          }
        }
        
        // 转换为当月的日期数组（用于显示打卡网格）
        // 将年中的天数转换为月中的天数
        const recordDays = currentMonthDays.map(day => {
          // 计算这一天是当月的第几天
          return day - dayOfYear + 1;
        });
        
        // 更新打卡数据
        setCheckInData({
          currentMonth: currentMonthCount,
          total: totalCount,
          streak: streakCount,
          records: recordDays
        });
      }
    } catch (error: any) {
      console.error("获取打卡记录失败", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      fetchSignInData();
      try {
        // 获取题库数据 - 修改为使用分页参数
        const bankRes = await listQuestionBankVoByPageUsingPost({
          pageSize: bankPagination.pageSize,
          current: bankPagination.current,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionBankList((bankRes.data as any)?.records ?? []);
        // 更新题库总数
        setBankPagination(prev => ({
          ...prev,
          total: (bankRes.data as any)?.total || 0
        }));
        
        // 获取面试题目数据
        const questionRes = await listQuestionVoByPageUsingPost({
          pageSize: questionPagination.pageSize,
          current: questionPagination.current,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionList((questionRes.data as any)?.records ?? []);
        // 更新面试题目总数
        setQuestionPagination(prev => ({
          ...prev,
          total: (questionRes.data as any)?.total || 0
        }));
        
        // 获取算法题目数据 - 使用算法页面的接口
        const algorithmRes = await listQuestionCodeVoByPageUsingPost({
          pageSize: algorithmPagination.pageSize,
          current: algorithmPagination.current,
          sortField: "createTime",
          sortOrder: "descend",
        });
        
        if ((algorithmRes as any)?.code === 0 && algorithmRes.data) {
          setAlgorithmList((algorithmRes.data as any).records || []);
          setAlgorithmPagination(prev => ({
            ...prev,
            total: (algorithmRes.data as any).total || 0
          }));
        }
      } catch (e: any) {
        message.error("获取数据失败，" + e.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [algorithmPagination.current, algorithmPagination.pageSize, 
      questionPagination.current, questionPagination.pageSize,
      bankPagination.current, bankPagination.pageSize]);

  // 处理算法题目分页变化
  const handleAlgorithmPageChange = (page: number, pageSize?: number) => {
    if (page > 0 && page <= Math.ceil(algorithmPagination.total / algorithmPagination.pageSize)) {
      setAlgorithmPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize || prev.pageSize
      }));
    } else {
      message.warning('请输入有效的页码');
    }
  };

  // 处理跳转到指定页
  const handleJumpToPage = (value: string) => {
    const page = parseInt(value, 10);
    if (!isNaN(page)) {
      handleAlgorithmPageChange(page);
    } else {
      message.warning('请输入有效的页码');
    }
  };

  // 添加面试题库分页变化处理函数
  const handleBankPageChange = (page: number, pageSize?: number) => {
    if (page > 0 && page <= Math.ceil(bankPagination.total / bankPagination.pageSize)) {
      setBankPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize || prev.pageSize
      }));
    } else {
      message.warning('请输入有效的页码');
    }
  };

  // 处理跳转到指定页
  const handleQuestionPageChange = (page: number, pageSize?: number) => {
    if (page > 0 && page <= Math.ceil(questionPagination.total / questionPagination.pageSize)) {
      setQuestionPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize || prev.pageSize
      }));
    } else {
      message.warning('请输入有效的页码');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 算法题目表格列定义
  const algorithmColumns = [
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
      title: '难度',
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
            {level}
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
          {(tags || []).slice(0, 2).map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      )
    }
  ];

  // 添加打卡处理函数
  const handleSignIn = async () => {
    try {
      const res = await addUserSignInUsingPost();
      if ((res as any)?.code === 0) {
        message.success('打卡成功！');
        // 重新获取打卡数据
        fetchSignInData();
      } else {
        message.error('打卡失败：' + (res as any)?.message || '未知错误');
      }
    } catch (error: any) {
      message.error('打卡失败：' + error.message);
    }
  };

  return (
    <div id="homePage" className="max-width-content">
      <div className="home-layout two-column-layout">
        {/* 左侧内容区域 - 上下布局 */}
        <div className="content-column content-main">
          {/* 算法题目区域 */}
          <div className="section-container">
            <Flex justify="space-between" align="center" className="section-header">
              <Title level={4} className="gradient-title algorithm-title">算法题目</Title>
              <Link href={"/algorithm/problems"} className="view-more-link">查看更多</Link>
            </Flex>
            <div className="algorithm-table-container">
              <Table
                columns={algorithmColumns}
                dataSource={algorithmList}
                rowKey="id"
                pagination={{ 
                  current: algorithmPagination.current,
                  pageSize: algorithmPagination.pageSize,
                  total: algorithmPagination.total,
                  size: 'small',
                  showSizeChanger: false,
                  showQuickJumper: true,
                  onChange: handleAlgorithmPageChange,
                  className: 'compact-pagination',
                  showTotal: (total) => `共 ${total} 条`,
                  onShowSizeChange: (current, size) => {
                    setAlgorithmPagination(prev => ({
                      ...prev,
                      current: 1,
                      pageSize: size
                    }));
                  }
                }}
                size="small"
                className="home-algorithm-table"
              />
            </div>
          </div>
          
          {/* 面试题库区域 */}
          <div className="section-container">
            <Flex justify="space-between" align="center" className="section-header">
              <Title level={4} className="gradient-title interview-title">面试题库</Title>
              <Link href={"/interview/banks"} className="view-more-link">查看更多</Link>
            </Flex>
            <div className="bank-grid">
              <QuestionBankList questionBankList={questionBankList} />
              {/* 添加分页组件 */}
              <Table
                dataSource={[]}
                columns={[]}
                pagination={{ 
                  current: bankPagination.current,
                  pageSize: bankPagination.pageSize,
                  total: bankPagination.total,
                  size: 'small',
                  showSizeChanger: false,
                  showQuickJumper: true,
                  onChange: handleBankPageChange,
                  className: 'compact-pagination',
                  showTotal: (total) => `共 ${total} 条`,
                }}
                className="pagination-only-table"
              />
            </div>
          </div>
          
          {/* 面试题目区域 */}
          <div className="section-container">
            <Flex justify="space-between" align="center" className="section-header">
              <Title level={4} className="gradient-title interview-title">面试题目</Title>
              <Link href={"/interview/questions"} className="view-more-link">查看更多</Link>
            </Flex>
            <div className="question-list-container">
              <QuestionList questionList={questionList} />
              {/* 添加分页组件 */}
              <Table
                dataSource={[]}
                columns={[]}
                pagination={{ 
                  current: questionPagination.current,
                  pageSize: questionPagination.pageSize,
                  total: questionPagination.total,
                  size: 'small',
                  showSizeChanger: false,
                  showQuickJumper: true,
                  onChange: handleQuestionPageChange,
                  className: 'compact-pagination',
                  showTotal: (total) => `共 ${total} 条`,
                }}
                className="pagination-only-table"
              />
            </div>
          </div>
        </div>
        
        {/* 右侧打卡区域 */}
        <div className="content-column content-right">
          {/* 用户打卡统计区域 */}
          <Card title="我的学习记录" className="checkin-card rich-card" bordered={false}>
            <span>{new Date().getMonth() + 1}月</span>
            <div className="checkin-stats">
              <div className="checkin-stat-item">
                <div className="checkin-stat-value">{checkInData.currentMonth}</div>
                <div className="checkin-stat-label">本月打卡</div>
              </div>
              <div className="checkin-stat-item">
                <div className="checkin-stat-value">{checkInData.total}</div>
                <div className="checkin-stat-label">总打卡天数</div>
              </div>
              <div className="checkin-stat-item">
                <div className="checkin-stat-value">{checkInData.streak}</div>
                <div className="checkin-stat-label">连续打卡</div>
              </div>
            </div>
            
            <Divider className="checkin-divider" />
            
            {/* 打卡记录图 */}
            <div className="checkin-container">
              {/* 星期标签 */}
              <div className="checkin-weekday-labels">
                <div className="checkin-weekday-label weekend">日</div>
                <div className="checkin-weekday-label">一</div>
                <div className="checkin-weekday-label">二</div>
                <div className="checkin-weekday-label">三</div>
                <div className="checkin-weekday-label">四</div>
                <div className="checkin-weekday-label">五</div>
                <div className="checkin-weekday-label weekend">六</div>
              </div>
              
              {/* 打卡记录网格 */}
              <div className="checkin-grid">
                {(() => {
                  // 获取当前日期信息
                  const now = new Date();
                  const currentYear = now.getFullYear();
                  const currentMonth = now.getMonth();
                  const currentDate = now.getDate();
                  
                  // 获取当月第一天是星期几
                  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                  
                  // 获取当月总天数
                  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                  
                  // 创建日历网格
                  const calendarDays = [];
                  
                  // 添加月初的空白格子
                  for (let i = 0; i < firstDayOfMonth; i++) {
                    calendarDays.push(
                      <div key={`empty-${i}`} className="checkin-day empty" />
                    );
                  }
                  
                  // 添加当月的日期格子
                  for (let i = 1; i <= daysInMonth; i++) {
                    const isToday = i === currentDate;
                    const isYesterday = i === currentDate - 1;
                    const isTomorrow = i === currentDate + 1;
                    const isChecked = checkInData.records.includes(i);
                    
                    let dateLabel = `${i}`;
                    if (isToday) dateLabel = "今";
                    else if (isYesterday) dateLabel = "昨";
                    else if (isTomorrow) dateLabel = "明";
                    
                    calendarDays.push(
                      <div 
                        key={`day-${i}`} 
                        className={`checkin-day ${isChecked ? 'checked' : ''} ${isToday ? 'today' : ''} ${isYesterday ? 'yesterday' : ''} ${isTomorrow ? 'tomorrow' : ''}`}
                        title={isToday ? "今天" : isYesterday ? "昨天" : isTomorrow ? "明天" : `${currentMonth + 1}月${i}日`}
                      >
                        <span className="date-label">{dateLabel}</span>
                      </div>
                    );
                  }
                  
                  // 添加月末的空白格子，确保总数为42（6行7列）
                  const totalCells = firstDayOfMonth + daysInMonth;
                  for (let i = 0; i < 42 - totalCells; i++) {
                    calendarDays.push(
                      <div key={`empty-end-${i}`} className="checkin-day empty" />
                    );
                  }
                  
                  return calendarDays;
                })()}
              </div>
            </div>
            
            {/* 今日任务按钮 - 根据今日是否已打卡显示不同内容 */}
            {(() => {
              // 获取今天是一年中的第几天
              const now = new Date();
              const startOfYear = new Date(now.getFullYear(), 0, 1);
              const todayDayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
              
              // 计算今天是当月的第几天
              const currentDate = now.getDate();
              
              // 检查今天是否已打卡
              const isTodayChecked = checkInData.records.includes(currentDate);
              
              return (
                <div 
                  className={`checkin-task-link ${isTodayChecked ? 'checked' : ''}`} 
                  onClick={isTodayChecked ? undefined : handleSignIn}
                >
                  <div className="checkin-task-card">
                    <div className="checkin-task-title">
                      {isTodayChecked ? '今日已完成' : '今日任务'}
                    </div>
                    <div className="checkin-task-subtitle">
                      {isTodayChecked 
                        ? `恭喜你完成了今日学习打卡` 
                        : '点击完成今日学习打卡'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      </div>
    </div>
  );
}
