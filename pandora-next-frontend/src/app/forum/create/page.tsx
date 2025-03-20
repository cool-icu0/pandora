"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Select, Space, Card, Typography } from "antd";
import { useRouter } from "next/navigation";
import { addPostUsingPost } from "@/api/postController";
import MdEditor from "@/components/MdEditor";
import "./index.css";

const { Title } = Typography;

/**
 * 创建帖子页面
 * @constructor
 */
export default function CreatePostPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  /**
   * 提交表单
   * @param values
   */
  const onFinish = async (values: any) => {
    // 转换标签为JSON格式
    const { tags , ...rest } = values;
    const postData = {
      ...rest,
      tags: tags,
    };

    setSubmitting(true);
    try {
      const res = await addPostUsingPost(postData);
      if ((res as any)?.code === 0) {
        message.success("发布成功");
        // 跳转到帖子详情页
        router.push(`/forum/${res.data}`);
      }
    } catch (e:any) {
      message.error("发布失败，" + e.message);
      // console.log("发布失败，" + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <Card className="create-post-card">
        <Title level={2} className="page-title">发布新帖子</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="create-form"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: "请输入帖子标题" }]}
          >
            <Input placeholder="请输入帖子标题" maxLength={100} className="title-input" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: "请输入帖子内容" }]}
          >
            <MdEditor placeholder="请输入帖子内容" className="content-editor" />
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="请输入标签，按回车分隔"
              className="tags-select"
              options={[
                { value: "前端", label: "前端" },
                { value: "后端", label: "后端" },
                { value: "算法", label: "算法" },
                { value: "数据库", label: "数据库" },
                { value: "面试", label: "面试" },
              ]}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space size="middle">
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                发布
              </Button>
              <Button onClick={() => router.push("/forum")} size="large">
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}