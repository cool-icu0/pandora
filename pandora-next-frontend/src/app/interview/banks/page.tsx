"use client";
import Title from "antd/es/typography/Title";
import { message } from "antd";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import QuestionBankList from "@/components/QuestionBankList";
import "./index.css";
import { useEffect, useState } from "react";

/**
 * 题库列表页面
 */
export default function BanksPage() {
  const [questionBankList, setQuestionBankList] = useState([]);
  
  const loadData = async () => {
    // 题库数量不多，直接全量获取
    const pageSize = 200;
    try {
      const res = await listQuestionBankVoByPageUsingPost({
        pageSize,
        sortField: "createTime",
        sortOrder: "descend",
      });
      setQuestionBankList((res.data as any).records ?? []);
    } catch (e:any) {
      message.error("获取题库列表失败，" + e.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div id="banksPage" className="max-width-content">
      <Title level={3}>题库大全</Title>
      <QuestionBankList questionBankList={questionBankList} />
    </div>
  );
}
