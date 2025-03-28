"use client"
import React, { use } from 'react';
import Link from 'next/link';
import {Spin, Tag} from 'antd';

interface RecommendQuestionListProps {
    loading: boolean;
    questions: any[];
    showScore?: boolean;
    scoreLabel?: string;
}

const RecommendQuestionList: React.FC<RecommendQuestionListProps> = ({
    loading,
    questions,
    showScore = true,
    scoreLabel = '相似度'
}) => {
    return (
        <Spin spinning={loading}>
            <div className="recommend-list">
                {questions.map((item: any) => (
                    <Link
                        key={item.questionId}
                        href={`/algorithm/problem/${item.questionId}`}
                        className="recommend-item"
                    >
                        <div className="recommend-content-wrapper">
                            <div className="recommend-title">{item.questionCodeVO.title}</div>
                            <div className="recommend-tags">
                                {item.questionCodeVO.tags?.map((tag: string) => (
                                    <Tag key={tag}>{tag}</Tag>
                                ))}
                            </div>
                        </div>
                        {showScore && (
                            <div className="recommend-score">
                                <span className="score-label">{scoreLabel}</span>
                                <span className="score-value">{Math.round(item.score * 100)}%</span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </Spin>
    );
};

export default RecommendQuestionList;