"use client";
import { Button, Form, Input, InputNumber, message } from "antd";
import React, { useState } from "react";
import { aiGenerateQuestionsUsingPost } from "@/api/questionController";
import "./index.css";

interface Props {}

/**
 * AI 生成题目页面
 * @param props
 * @constructor
 */
const AiGenerateQuestionPage: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * 提交
   *
   * @param values
   */
  const doSubmit = async (values: API.QuestionAIGenerateRequest) => {
    const hide = message.loading("正在操作");
    setLoading(true);
    try {
      await aiGenerateQuestionsUsingPost(values);
      hide();
      message.success("操作成功");
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
    setLoading(false);
  };

  return (
    <div id="aiGenerateQuestionPage">
      <h2>AI 生成题目</h2>
      <Form form={form} style={{ marginTop: 24 }} onFinish={doSubmit}>
        <Form.Item label="题目方向" name="questionType">
          <Input placeholder="比如 Java" />
        </Form.Item>
        <Form.Item label="题目数量" name="number">
          <InputNumber defaultValue={10} max={50} min={1} />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            style={{ width: 180 }}
            type="primary"
            htmlType="submit"
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default AiGenerateQuestionPage;