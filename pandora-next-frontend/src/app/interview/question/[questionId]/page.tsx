
"use client";

import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import { useEffect, useState } from "react";
import "./index.css";

/**
 * 题目详情页
 * @constructor
 */
export default function QuestionPage({ params }) {
  const { questionId } = params;
  const [question, setQuestion] = useState(undefined);
  const [loading, setLoading] = useState(true);

  // 获取题目详情
  useEffect(() => {
    const fetchQuestionData = async () => {
      setLoading(true);
      try {
        const res = await getQuestionVoByIdUsingGet({
          id: questionId,
        });
        setQuestion((res as any).data);
      } catch (e:any) {
        message.error("获取题目详情失败，" + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, [questionId]);

  // 加载状态
  if (loading) {
    return <div>加载中...</div>;
  }

  // 错误处理
  if (!question) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  return (
    <div id="questionPage">
      <QuestionCard question={question} />
    </div>
  );
}
