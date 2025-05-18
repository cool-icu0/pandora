"use client";
import {Space} from "antd";
import TagList from "@/components/TagList";
import Link from "next/link";
import "./index.css";
import {ActionType, ProColumns, ProTable} from "@ant-design/pro-components";
import {useRef} from "react";

interface Props {
    questionBankId?: number;
    questionList: API.QuestionVO[];
    cardTitle?: string;
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const BankQuestionList = (props: Props) => {
    const {questionList = [], cardTitle, questionBankId} = props;
    const actionRef = useRef<ActionType>();

    /**
     * 表格列配置
     */
    const columns: ProColumns<API.QuestionVO>[] = [
        {
            title: "题目",
            dataIndex: "title",
            valueType: "text",
            width: "600px",
            render: (_, record) => {
                return (
                    <Link
                        href={
                            questionBankId
                                ? `/interview/bank/${questionBankId}/question/${record.id}`
                                : `/interview/question/${record.id}`
                        }
                        style={{fontSize: "16px", fontWeight: "bold"}}
                    >
                        {record.title}
                    </Link>
                );
            },
        },
        {
            title: "难度",
            dataIndex: "difficulty",
            width: "160px",
            render: (text, record) => (
                <span
                    style={{
                        color:
                            record.difficulty === "简单"
                                ? "green"
                                : record.difficulty === "中等"
                                    ? "#ee9e0b"
                                    : "red",
                        fontSize: "16px",
                        fontWeight: "bold", // 添加这行使文本加粗
                    }}
                >
          {record.difficulty}
        </span>
            ),
        },
        {
            title: "标签",
            dataIndex: "tagList",
            valueType: "select",
            fieldProps: {
                mode: "tags",
            },
            render: (_, record) => (
                <Space>
                    <>
                        {/*{record?.isVip == 0 && <VIPTag />}*/}
                        <TagList tagList={record.tagList}/>
                    </>
                </Space>
            ),
        },
    ];

    return (
        <div id="question-table-plus">
            <ProTable<API.QuestionVO>
                actionRef={actionRef}
                size="middle"
                dataSource={questionList}
                columns={columns}
                search={false} // 取消搜索行
                toolBarRender={false} // 取消操作区
            />
        </div>
    );
};

export default BankQuestionList;
