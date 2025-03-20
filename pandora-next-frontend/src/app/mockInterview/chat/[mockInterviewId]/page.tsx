"use client";
import { Button, Card, Input, List, message, Tag } from "antd";
import React, { useEffect, useState } from "react";
import {
  getMockInterviewByIdUsingGet,
  handleMockInterviewEventUsingPost,
} from "@/api/mockInterviewController";
import "./index.css";

interface Message {
  message: string;
  role: string;
}

interface MockInterviewDetail extends API.MockInterview {
  parsedMessages?: Message[];
}

export default function InterviewRoomPage({ params }) {
  const { mockInterviewId } = params;
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [interview, setInterview] = useState<MockInterviewDetail>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  // 加载面试数据
  const loadInterview = async () => {
    try {
      const res = await getMockInterviewByIdUsingGet({ id: mockInterviewId });
      const data = res.data as MockInterviewDetail;
      // 解析历史消息
      if (data.messages) {
        const processedData = data.messages;
        try {
          const parsedData = JSON.parse(processedData);
          // 根据状态过滤消息
          const filterCount = data.status === 0 ? 1 : 2;
          data.parsedMessages = parsedData.slice(filterCount);
        } catch (error) {
          console.error("JSON解析失败:", error);
          data.parsedMessages = [];
        }
        // 确保 parsedMessages 不为 undefined 再设置状态
        if (data.parsedMessages) {
          setMessages(data.parsedMessages);
        }
      }

      setInterview(data);
      setIsStarted(data.status === 1);
      setIsEnded(data.status === 2);
    } catch (error) {
      message.error("加载面试数据失败");
    }
  };

  useEffect(() => {
      loadInterview();
  }, []);

  // 处理事件
  const handleEvent = async (eventType: string, msg?: string) => {
    setLoading(true);
    try {
      const res = await handleMockInterviewEventUsingPost({
        event: eventType,
        id: interview?.id,
        message: msg,
      });

      // 更新消息列表
      const newMessage: Message = {
        message: msg || (eventType === "start" ? "面试开始" : "面试结束"),
        role: "user",
      };

      const aiResponse: Message = {
        message: res.data || "收到请求",
        role: "assistant",
        timestamp: Date.now() + 1,
      } as any;

      setMessages([...messages, newMessage, aiResponse]);

      // 更新状态
      if (eventType === "start") setIsStarted(true);
      if (eventType === "chat" && res.data.includes("【面试结束】")) {
        setIsEnded(true);
      }
      if (eventType === "end") setIsEnded(true);
    } catch (error) {
      message.error("操作失败");
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    await handleEvent("chat", inputMessage);
    setInputMessage("");
  };

  return (
    <div id="interviewRoomPage">
      {/* 标题 */}
      <div className="header">
        <h1>模拟面试 #{interview?.id}</h1>
        <Tag color={isEnded ? "red" : isStarted ? "green" : "orange"}>
          {isEnded ? "已结束" : isStarted ? "进行中" : "待开始"}
        </Tag>
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <Button
          type="primary"
          onClick={() => handleEvent("start")}
          disabled={isStarted || isEnded}
          loading={loading}
        >
          开始面试
        </Button>
        <Button
          danger
          onClick={() => handleEvent("end")}
          disabled={!isStarted || isEnded}
          loading={loading}
        >
          结束面试
        </Button>
      </div>

      {/* 消息列表 */}
      <Card className="message-area">
        <List
          dataSource={messages}
          split={false}
          className="messages-list"
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent: item.role =="assistant" ? "flex-start" : "flex-end",
              }}
            >
              <div className={`message-bubble ${item.role=="user" ? "user" : "assistant"}`}>
                <div className="message-content">{item.message}</div>
              </div>
            </List.Item>
          )}
        />
      </Card>

      {/* 输入区域 */}
      <div className="input-area">
        <Input.TextArea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="输入你的回答..."
          disabled={!isStarted || isEnded}
          rows={3}
          autoSize={{ minRows: 3, maxRows: 6 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button
          type="primary"
          onClick={sendMessage}
          loading={loading}
          disabled={!isStarted || isEnded}
        >
          发送
        </Button>
      </div>
    </div>
  );
}
