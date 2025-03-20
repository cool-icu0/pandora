import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Space, Divider, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface TestCase {
  input: string;
  output: string;
}

interface EditTestCaseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (testCases: TestCase[]) => void;
  initialTestCases: TestCase[];
}

const EditTestCaseModal: React.FC<EditTestCaseModalProps> = ({
  visible,
  onClose,
  onSave,
  initialTestCases,
}) => {
  const [form] = Form.useForm();
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (visible && initialTestCases.length > 0) {
      setTestCases(initialTestCases);
    } else if (visible) {
      // 如果没有初始测试用例，至少添加一个空的
      setTestCases([{ input: '', output: '' }]);
    }
  }, [visible, initialTestCases]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = [...testCases];
    newTestCases.splice(index, 1);
    setTestCases(newTestCases);
  };

  const handleInputChange = (index: number, field: 'input' | 'output', value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = () => {
    // 过滤掉空的测试用例
    const validTestCases = testCases.filter(tc => tc.input.trim() !== '' || tc.output.trim() !== '');
    if (validTestCases.length === 0) {
      // 如果没有有效的测试用例，至少保留一个
      onSave([{ input: '', output: '' }]);
    } else {
      onSave(validTestCases);
    }
    onClose();
  };

  return (
    <Modal
      title="修改测试用例"
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        {testCases.map((testCase, index) => (
          <div key={index}>
            {index > 0 && <Divider />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <Title level={5} style={{ margin: 0 }}>测试用例 {index + 1}</Title>
              {testCases.length > 1 && (
                <Button 
                  icon={<DeleteOutlined />} 
                  danger 
                  onClick={() => handleRemoveTestCase(index)}
                  type="text"
                >
                  删除
                </Button>
              )}
            </div>
            
            <Form.Item label="输入">
              <TextArea
                rows={4}
                value={testCase.input}
                onChange={(e) => handleInputChange(index, 'input', e.target.value)}
                placeholder="请输入测试用例的输入数据"
              />
            </Form.Item>
            
            <Form.Item label="预期输出">
              <TextArea
                rows={4}
                value={testCase.output}
                onChange={(e) => handleInputChange(index, 'output', e.target.value)}
                placeholder="请输入测试用例的预期输出"
              />
            </Form.Item>
          </div>
        ))}
        
        <Form.Item>
          <Button 
            type="dashed" 
            onClick={handleAddTestCase} 
            block 
            icon={<PlusOutlined />}
          >
            添加测试用例
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTestCaseModal;