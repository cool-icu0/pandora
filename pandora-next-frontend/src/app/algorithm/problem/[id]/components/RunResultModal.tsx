import React from 'react';
import { Modal, Spin, Result, Tabs, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface RunResultModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  results: any[];
  status: 'success' | 'error' | 'pending';
  executionTime: number;
  activeTabKey: string;
  setActiveTabKey: (key: string) => void;
}

const RunResultModal: React.FC<RunResultModalProps> = ({
  visible,
  onClose,
  loading,
  results,
  status,
  executionTime,
  activeTabKey,
  setActiveTabKey,
}) => {
  // 渲染运行结果
  const renderRunResults = () => {
    if (loading) {
      return (
        <div className="run-loading">
          <Spin size="large" />
          <p>正在运行代码，请稍候...</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <Result
          icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
          title="通过"
          subTitle={`执行用时: ${executionTime} ms`}
          status="success"
        />
      );
    }

    if (status === 'error') {
      return (
        <Result
          icon={<CloseCircleFilled style={{ color: '#ff4d4f' }} />}
          title="未通过"
          subTitle={`执行用时: ${executionTime} ms`}
          status="error"
        />
      );
    }

    return null;
  };

  // 渲染测试用例详情
  const renderTestCaseDetails = () => {
    return (
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} className="run-tabs">
        {results.map((result, index) => (
          <TabPane 
            tab={
              <span>
                {result.status === 'success' 
                  ? <CheckCircleFilled style={{ color: '#52c41a' }} /> 
                  : <CloseCircleFilled style={{ color: '#ff4d4f' }} />
                } Case {index + 1}
              </span>
            } 
            key={String(index + 1)}
          >
            <div className="test-case-detail">
              <div className="test-case-section">
                <Title level={5}>输入</Title>
                <pre className="test-case-io">{result.input}</pre>
              </div>
              
              <div className="test-case-section">
                <Title level={5}>预期输出</Title>
                <pre className="test-case-io">{result.output}</pre>
              </div>
              
              <div className="test-case-section">
                <Title level={5}>
                  实际输出
                  {result.status === 'error' && (
                    <Text type="danger" style={{ marginLeft: '8px' }}>（错误）</Text>
                  )}
                </Title>
                <pre className={`test-case-io ${result.status === 'error' ? 'error-output' : ''}`}>
                  {result.output}
                </pre>
              </div>
            </div>
          </TabPane>
        ))}
      </Tabs>
    );
  };

  return (
    <Modal
      title="测试结果"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      className="run-result-modal"
    >
      <div className="run-result-container">
        {renderRunResults()}
        {!loading && results.length > 0 && renderTestCaseDetails()}
      </div>
    </Modal>
  );
};

export default RunResultModal;