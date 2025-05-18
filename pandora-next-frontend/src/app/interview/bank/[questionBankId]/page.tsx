"use client";
import {Avatar, Button, Card, message, Modal, QRCode} from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Meta from "antd/es/card/Meta";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import BankQuestionList from "@/components/BankQuestionList";
import { ShareAltOutlined } from "@ant-design/icons";
import "./index.css";
import { useEffect, useState } from "react";

/**
 * 题库详情页
 * @constructor
 */
export default function BankPage({ params }) {
  const { questionBankId } = params;
  const [bank, setBank] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleShareClick = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getQuestionBankVoByIdUsingGet({
          id: questionBankId,
          needQueryQuestionList: true,
          pageSize: 200,
        });
        setBank(res.data);
      } catch (e: any) {
        message.error("获取题库详情失败：" + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionBankId]);

  // 加载中状态
  if (loading) {
    return <div>加载中...</div>;
  }

  // 错误处理
  if (!bank) {
    return <div>获取题库详情失败，请刷新重试</div>;
  }

  // 获取第一道题目，用于 "开始刷题" 按钮跳转
  let firstQuestionId;
  if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
    firstQuestionId = bank.questionPage.records[0].id;
  }

  return (
    <div id="bankPage" className="max-width-content">
      <Card>
        <Meta
          avatar={<Avatar src={bank.picture} size={72} />}
          title={
            <Title level={3} style={{ marginBottom: 0 }}>
              {bank.title}
            </Title>
          }
          description={
            <>
              <Paragraph type="secondary">{bank.description}</Paragraph>
              <Button
                type="primary"
                shape="round"
                href={`/interview/bank/${questionBankId}/question/${firstQuestionId}`}
                target="_blank"
                disabled={!firstQuestionId}
              >
                开始刷题
              </Button>
              <Button
                  type="dashed"
                  shape="round"
                  icon={<ShareAltOutlined />}
                  disabled={!firstQuestionId}
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    color: "#313b60",
                    backgroundColor: "#dad9ce",
                  }}
                  onClick={handleShareClick}
              >
                分享
              </Button>
            </>
          }
        />
      </Card>
      <div style={{ marginBottom: 16 }} />
        <BankQuestionList
        questionBankId={questionBankId}
        questionList={bank.questionPage?.records ?? []}
        cardTitle={`题目列表（${bank.questionPage?.total || 0}）`}
        />
        <Modal
            title={null}
            open={isModalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            centered
            bodyStyle={{
                padding: 24,
                borderRadius: "12px",
            }}
        >
            <div style={{ textAlign: "left" }}>
                {/* 标题部分 */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
            <span
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                }}
            >
              🔗 分享此题库
            </span>
                </div>

                {/* 分隔线 */}
                <div style={{ marginBottom: 16, borderTop: "1px solid #e4e4e4" }} />

                {/* 分享链接部分 */}
                <div style={{ marginBottom: 32 }}>
            <span
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 8,
                }}
            >
              分享链接：
            </span>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", // 轻微阴影让内容有层次感
                        }}
                    >
                        <Paragraph
                            copyable
                            style={{
                                margin: 0,
                                flex: 1,
                                fontSize: 14,
                                wordBreak: "break-all",
                            }}
                        >
                            {window.location.href}
                        </Paragraph>
                    </div>
                </div>

                {/* 分隔线 */}
                <div style={{ margin: "24px 0", borderTop: "1px solid #e4e4e4" }} />

                {/* 二维码部分 */}
                <div>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 600,
                            marginBottom: 16,
                        }}
                    >
                        二维码分享：
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 16,
                            borderRadius: "12px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <QRCode value={window.location.href} size={180} />
                    </div>
                </div>
            </div>
        </Modal>
    </div>
  );
}
