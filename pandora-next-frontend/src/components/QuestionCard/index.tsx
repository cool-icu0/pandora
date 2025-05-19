"use client";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
import {Card, Button, Modal, QRCode, Tabs, Tag} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import {ShareAltOutlined} from "@ant-design/icons";
import "./index.css";
import {useState} from "react";

interface Props {
    question: API.QuestionVO;
}

/**
 * 题目卡片
 * @param props
 * @constructor
 */
const QuestionCard = (props: Props) => {
    const {question} = props;
    // 控制答案是否显示
    const [showAnswer, setShowAnswer] = useState(false);
    // 控制答案类型切换
    const [activeTab, setActiveTab] = useState('recommend');
    const [isModalVisible, setModalVisible] = useState(false);

    const handleShareClick = () => {
        setModalVisible(true);
    };

    // 签到
    useAddUserSignInRecord();

    const tabItems = [
        {
            key: 'recommend',
            label: '推荐答案',
            children: <>{showAnswer && <MdViewer value={question.answer}/>}</>,
        },
        {
            key: 'ai',
            label: 'AI生成',
            children: <MdViewer value={question.aiAnswer || 'AI答案暂未生成'}/>,
        },
    ];

    return (
        <div className="question-card">
            <Card>
                <Title level={1} style={{fontSize: 24}}>
                    {question.title}
                </Title>
                <Tag key={question.difficulty}>{question.difficulty}</Tag>
                <TagList tagList={question.tagList}/>
                <Button type="dashed" shape="round"
                        icon={<ShareAltOutlined/>}
                        style={{
                            marginTop: 16,
                            fontSize: 16,
                            color: "#313b60",
                            backgroundColor: "#dad9ce",
                        }}
                        onClick={handleShareClick}
                >分享</Button>
                <div style={{marginBottom: 16}}/>
                <MdViewer value={question.content}/>
            </Card>
            <div style={{marginBottom: 16}}/>
            <Card
                title="推荐答案"
                extra={
                    <Button type="primary" onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? '隐藏答案' : '查看答案'}
                    </Button>
                }
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    tabBarStyle={{marginBottom: 24, fontWeight: 600, fontSize: 18}}
                />
            </Card>
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
                <div style={{textAlign: "left"}}>
                    <div style={{textAlign: "center", marginBottom: 24}}>
                        <span style={{fontSize: 24, fontWeight: "bold"}}>🔗 分享此题目</span>
                    </div>
                    <div style={{marginBottom: 16, borderTop: "1px solid #e4e4e4"}}/>
                    <div style={{marginBottom: 32}}>
                            <span style={{
                                fontSize: 18,
                                fontWeight: 600,
                                display: "block",
                                marginBottom: 8
                            }}>分享链接：</span>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 16px",
                            borderRadius: "8px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                        }}>
                            <Paragraph copyable style={{
                                margin: 0,
                                flex: 1,
                                fontSize: 14,
                                wordBreak: "break-all"
                            }}>{window.location.href}</Paragraph>
                        </div>
                    </div>
                    <div style={{margin: "24px 0", borderTop: "1px solid #e4e4e4"}}/>
                    <div>
                        <div style={{fontSize: 18, fontWeight: 600, marginBottom: 16}}>二维码分享：</div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 16,
                            borderRadius: "12px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                        }}>
                            <QRCode value={window.location.href} size={180}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default QuestionCard;
