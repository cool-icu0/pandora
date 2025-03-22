"use client";
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { message } from "antd";
import { searchQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import { useSearchParams } from "next/navigation";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default function QuestionsPage() {
  // 使用 useState 管理状态
  const [questionList, setQuestionList] = useState([]);
  const [total, setTotal] = useState(0);
  
  // 使用 useSearchParams 获取 URL 查询参数
  const searchParams = useSearchParams();
  const searchText = searchParams.get("q") || "";
  
  // 使用 useEffect 在组件挂载后获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await searchQuestionVoByPageUsingPost({
          searchText,
          pageSize: 12,
          sortField: "createTime",
          sortOrder: "descend",
        });
        setQuestionList((res.data as any)?.records ?? []);
        setTotal((res.data as any)?.total ?? 0);
      } catch (e: any) {
        message.error("获取题目列表失败，" + e.message);
      }
    };
    
    fetchData();
  }, [searchText]); // 当 searchText 变化时重新获取数据

  return (
    <div id="questionsPage" className="max-width-content">
      <Title level={3}>面试题目</Title>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  );
}
