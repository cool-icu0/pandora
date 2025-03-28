'use client';

import { useEffect, useState } from 'react';
import { Avatar, Card, Tabs, Spin, message, Flex, Typography, Tag, Statistic } from 'antd';
import { getUserVoByIdUsingGet } from '@/api/userController';
import { useParams } from 'next/navigation';
import './index.css';

const { Title, Paragraph } = Typography;

export default function UserInfoPage() {
    const params = useParams();
    const userId = params.id as string;
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        fetchUserInfo();
    }, [userId]);

    const fetchUserInfo = async () => {
        try {
            setLoading(true);
            const res = await getUserVoByIdUsingGet({ id: userId });
            if ((res as any)?.code === 0) {
                setUserInfo((res as any).data);
            } else {
                message.error('获取用户信息失败');
            }
        } catch (error: any) {
            message.error('获取用户信息失败：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="加载中..." />
            </div>
        );
    }

    if (!userInfo) {
        return <div className="error-message">用户不存在</div>;
    }

    return (
        <div className="user-info-page max-width-content">
            <Card bordered={false} className="user-info-card">
                <Flex align="center" className="user-header">
                    <Avatar 
                        size={120} 
                        src={userInfo.userAvatar}
                        className="user-avatar"
                    />
                    <div className="user-basic-info">
                        <Title level={2} className="user-name">
                            {userInfo.userName}
                        </Title>
                        <Paragraph className="user-profile">
                            {userInfo.userProfile || '这个人很懒，什么都没写~'}
                        </Paragraph>
                        <div className="user-tags">
                            {userInfo.tags?.map((tag: string) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        </div>
                    </div>
                </Flex>

                <div className="user-statistics">
                    <Flex justify="space-around">
                        <Statistic title="刷题数" value={userInfo.questionCount || 0} />
                        <Statistic title="打卡天数" value={userInfo.signInCount || 0} />
                        <Statistic title="获赞数" value={userInfo.thumbCount || 0} />
                        <Statistic title="收藏数" value={userInfo.favourCount || 0} />
                    </Flex>
                </div>
            </Card>

            <Card bordered={false} className="user-detail-card">
                <Tabs
                    defaultActiveKey="records"
                    items={[
                        {
                            key: 'records',
                            label: '刷题记录',
                            children: (
                                <div className="user-records">
                                    {/* 这里可以添加刷题记录列表 */}
                                    <div className="empty-placeholder">暂无刷题记录</div>
                                </div>
                            ),
                        },
                        {
                            key: 'favorites',
                            label: '收藏题目',
                            children: (
                                <div className="user-favorites">
                                    {/* 这里可以添加收藏题目列表 */}
                                    <div className="empty-placeholder">暂无收藏题目</div>
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
}