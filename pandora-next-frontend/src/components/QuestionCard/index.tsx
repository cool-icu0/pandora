"use client";
import { Card } from "antd";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
import "./index.css";
import { useState } from "react";
import { Button } from "antd";

interface Props {
  question: API.QuestionVO;
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
  const { question } = props;
  // 控制答案是否显示
  const [showAnswer, setShowAnswer] = useState(false);

  // 签到
  useAddUserSignInRecord();

  return (
    <div className="question-card">
      <Card>
        <Title level={1} style={{ fontSize: 24 }}>
          {question.title}
        </Title>
        <TagList tagList={question.tagList} />
        <div style={{ marginBottom: 16 }} />
        <MdViewer value={question.content} />
      </Card>
      <div style={{ marginBottom: 16 }} />
      <Card 
        title="推荐答案" 
        extra={
          <Button type="primary" onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? '隐藏答案' : '查看答案'}
          </Button>
        }
      >
        {showAnswer && <MdViewer value={question.answer} />}
      </Card>
    </div>
  );
};

export default QuestionCard;
