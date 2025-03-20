"use client";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { addMockInterviewUsingPost } from "@/api/mockInterviewController";
import { useRouter } from "next/navigation";
import "./index.css";

interface Props {}

/**
 * 创建 AI 模拟面试页面
 * @param props
 * @constructor
 */
const CreateMockInterviewPage: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * 提交表单
   *
   * @param values
   */
  const doSubmit = async (values: API.MockInterviewAddRequest) => {
    const hide = message.loading("正在创建模拟面试...");
    setLoading(true);
    try {
      const res = await addMockInterviewUsingPost(values);
      hide();
      message.success("模拟面试创建成功");
      form.resetFields(); // 重置表单
      // 跳转到模拟面试列表页面
      router.push("/mockInterview/chat/" + res.data);
    } catch (error: any) {
      hide();
      message.error("创建失败，" + error.message);
    }
    setLoading(false);
  };

  return (
    <div id="createMockInterviewPage">
      <h2>创建 AI 模拟面试</h2>
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        {/* 工作岗位 */}
        <Form.Item label="工作岗位" name="jobPosition">
          <Input placeholder="请输入工作岗位，例如：Java 开发工程师" />
        </Form.Item>

        {/* 工作年限 */}
        <Form.Item label="工作年限" name="workExperience">
          <Input placeholder="请输入工作年限，例如：3 年" />
        </Form.Item>

        {/* 面试难度 */}
        <Form.Item label="面试难度" name="difficulty">
          <Input placeholder="请输入面试难度，例如：中等" />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item>
          <Button
            loading={loading}
            style={{ width: 180 }}
            type="primary"
            htmlType="submit"
          >
            创建模拟面试
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateMockInterviewPage;