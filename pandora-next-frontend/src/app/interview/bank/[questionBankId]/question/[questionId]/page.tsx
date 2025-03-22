"use client";
import { Flex, Menu, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";
import "./index.css";
import { useEffect, useState } from "react";

/**
 * 题库题目详情页
 * @constructor
 */
export default function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = params;
  const [bank, setBank] = useState<any>();
  const [question, setQuestion] = useState<any>();
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 获取题库详情
        const bankRes = await getQuestionBankVoByIdUsingGet({
          id: questionBankId,
          needQueryQuestionList: true,
          pageSize: 200,
        });
        setBank(bankRes.data);

        // 获取题目详情
        const questionRes = await getQuestionVoByIdUsingGet({
          id: questionId,
        });
        setQuestion(questionRes.data);
      } catch (e: any) {
        message.error("获取数据失败：" + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionBankId, questionId]);

  // 加载中状态
  if (loading) {
    return <div>加载中...</div>;
  }

  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  // 题目菜单列表
  const questionMenuItemList = (bank.questionPage?.records || []).map((q: any) => {
    return {
      label: (
        <Link href={`/interview/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>
      ),
      key: q.id,
    };
  });

  return (
    <div id="bankQuestionPage">
      <Flex gap={24}>
        <Sider width={240} theme="light" style={{ padding: "24px 0" }}>
          <Title level={4} style={{ padding: "0 20px" }}>
            {bank.title}
          </Title>
          <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
        </Sider>
        <Content>
          <QuestionCard question={question} />
        </Content>
      </Flex>
    </div>
  );
}
