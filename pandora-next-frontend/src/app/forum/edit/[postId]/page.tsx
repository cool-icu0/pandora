"use client";
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Select, Space, Typography, Card, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { editPostUsingPost } from '@/api/postController';
import MdEditor from '@/components/MdEditor';
import './index.css';

const { Title } = Typography;

const EditPostPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 在组件加载时获取帖子信息
  useEffect(() => {
    const postInfoStr = searchParams.get('postInfo');
    if (postInfoStr) {
      try {
        const postInfo = JSON.parse(postInfoStr);
        form.setFieldsValue({
          title: postInfo.title,
          content: postInfo.content,
          tags: postInfo.tagList,
        });
      } catch (e) {
        message.error('获取帖子信息失败');
      }
    }
    // 添加一个短暂的延迟，模拟加载过程，使页面过渡更自然
    setTimeout(() => {
      setInitialLoading(false);
    }, 300);
  }, [searchParams, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const postId = window.location.pathname.split('/').pop();
      await editPostUsingPost({
        id: postId,
        title: values.title,
        content: values.content,
        tags: values.tags,
      });
      message.success('修改成功');
      // 跳转回帖子详情页
      router.push(`/forum/${postId}`);
    } catch (e: any) {
      message.error('修改失败，' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-post-container">
      {initialLoading ? (
        <div className="loading-container">
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <Card className="edit-post-card">
          <Title level={2} className="page-title">编辑帖子</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="edit-form"
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入标题" className="title-input" />
            </Form.Item>

            <Form.Item
              name="content"
              label="内容"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <MdEditor/>
            </Form.Item>

            <Form.Item
              name="tags"
              label="标签"
            >
              <Select
                mode="tags"
                placeholder="请输入标签"
                style={{ width: '100%' }}
                className="tags-select"
              />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space size="middle">
                <Button type="primary" htmlType="submit" loading={loading} size="large">
                  提交修改
                </Button>
                <Button onClick={() => router.back()} size="large">
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default EditPostPage;