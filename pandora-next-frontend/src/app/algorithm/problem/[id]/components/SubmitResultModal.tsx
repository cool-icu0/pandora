'use client';

import React from 'react';
import { Modal, Button, Result, Space, Typography, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import CodeEditor from '@/components/CodeEditor';
import { sub } from '@antv/g2/lib/utils/vector';

const { Title, Text, Paragraph } = Typography;

interface SubmitResultModalProps {
  visible: boolean;
  onClose: () => void;
  submitResult: any;
  onViewSubmissions: () => void;
}

const SubmitResultModal: React.FC<SubmitResultModalProps> = ({
  visible,
  onClose,
  submitResult,
  onViewSubmissions,
}) => {
  if (!submitResult) {
    return null;
  }

  const getStatusIcon = (status: number) => {
    if (status === 2) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    } else if (status === 3){
      return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
    } else {
      return <LoadingOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusTag = (status: string) => {
    if (status === '成功') {
      return <Tag color="success">通过</Tag>;
    } else if (status === '失败') {
      return <Tag color="error">未通过</Tag>;
    } else {
      return <Tag color="processing">评测中</Tag>;
    }
  };

  return (
    <Modal
      title="提交结果"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
        <Button key="view" type="primary" onClick={onViewSubmissions}>
          查看我的提交记录
        </Button>,
      ]}
      width={600}
    >
      <Result
        icon={getStatusIcon(submitResult.submitState)}
        title={
          <Space>
            <span>提交结果：</span>
            {getStatusTag(submitResult.submitState === 0 || submitResult.submitState === 1 ? '等待' : submitResult.judgeInfo.message)}
          </Space>
        }
        subTitle={
          <div style={{ textAlign: 'left', marginTop: 20 }}>
            <Paragraph>
              <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <div>
                  <Text strong>执行用时：</Text>
                  <Text>{submitResult.judgeInfo?.time || '0'} ms</Text>
                </div>
                <div>
                  <Text strong>内存消耗：</Text>
                  <Text>{submitResult.judgeInfo?.memory || '0'} KB</Text>
                </div>
                <div>
                  <Text strong>提交语言：</Text>
                  <Text>{submitResult.submitLanguage}</Text>
                </div>
                <div>
                  <Text strong>提交时间：</Text>
                  <Text>{new Date(submitResult.createTime).toLocaleString()}</Text>
                </div>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                    {submitResult && (<CodeEditor
                        value={submitResult.submitCode || ''}
                        language={submitResult.submitLanguage}
                        />
                    )}
                </div>
              </Space>
            </Paragraph>
          </div>
        }
      />
    </Modal>
  );
};

export default SubmitResultModal;