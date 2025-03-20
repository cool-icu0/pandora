import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Tabs } from "antd";
import MdEditor from "@/components/MdEditor";

interface Props {
  visible: boolean;
  oldData: API.QuestionCode | undefined;
  onSubmit: () => void;
  onCancel: () => void;
}

const UpdateAlgorithmModal: React.FC<Props> = ({ visible, oldData, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [judgeCases, setJudgeCases] = useState<{ input: string; output: string }[]>(
    oldData?.judgeCase ? JSON.parse(oldData.judgeCase) : []
  );
  const [judgeConfig, setJudgeConfig] = useState<{ timeLimit: number; memoryLimit: number; stackLimit: number }>(
    oldData?.judgeConfig? JSON.parse(oldData.judgeConfig) : {
      timeLimit: 0,
      memoryLimit: 0,
      stackLimit: 0,
  });
  const [tags, setTags] = useState<string[]>(
    oldData?.tags ? JSON.parse(oldData.tags) : []
  );

  const handleTagChange = (value: string[]) => {
    setTags(value);
  };

  const handleJudgeCaseChange = (index: number, field: "input" | "output", value: string) => {
    const newJudgeCases = [...judgeCases];
    newJudgeCases[index][field] = value;
    setJudgeCases(newJudgeCases);
  };

  const handleAddJudgeCase = () => {
    setJudgeCases([...judgeCases, { input: "", output: "" }]);
  };
  const handleJudgeConfigChange = (field: "timeLimit" | "memoryLimit" | "stackLimit", value: number) => {
    setJudgeConfig({ ...judgeConfig, [field]: value });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.tags = JSON.stringify(tags);
      values.judgeCase = JSON.stringify(judgeCases);
      values.judgeConfig = JSON.stringify(judgeConfig);
      console.log("values", values);
      // Call API to update algorithm question
      // await updateAlgorithmUsingPost({ ...oldData, ...values, judgeCase: judgeCases });
      onSubmit();
    } catch (error) {
      console.error("Failed to update algorithm question:", error);
    }
  };

  const items = [
    {
      key: '1',
      label: '基本信息',
      children: (
        <>
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入题目标题" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="标签列表">
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入标签"
              value={tags}
              onChange={handleTagChange}
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: '题目内容',
      children: (
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: "请输入题目内容" }]}
        >
          <MdEditor/>
        </Form.Item>
      ),
    },
    {
      key: '3',
      label: '题目答案',
      children: (
        <Form.Item
          label="答案"
          name="answer"
          rules={[{ required: true, message: "请输入题目答案" }]}
        >
          <MdEditor/>
        </Form.Item>
      ),
    },
    {
      key: '4',
      label: '判题信息',
      children: (
        <>
          <Form.Item label="判题用例">
            {judgeCases.map((caseItem, index) => (
              <div key={index} style={{ display: "flex", marginBottom: 8 }}>
                <Input
                  placeholder="输入"
                  value={caseItem.input}
                  onChange={(e) => handleJudgeCaseChange(index, "input", e.target.value)}
                  style={{ marginRight: 8 }}
                />
                <Input
                  placeholder="输出"
                  value={caseItem.output}
                  onChange={(e) => handleJudgeCaseChange(index, "output", e.target.value)}
                />
              </div>
            ))}
            <Button type="dashed" onClick={handleAddJudgeCase}>
              添加判题用例
            </Button>
          </Form.Item>
          <Form.Item label="时间限制">
            <Input
              type="number"
              value={judgeConfig.timeLimit}
              onChange={(e) => handleJudgeConfigChange("timeLimit", Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="内存限制">
            <Input
              type="number"
              value={judgeConfig.memoryLimit}
              onChange={(e) => handleJudgeConfigChange("memoryLimit", Number(e.target.value))}
            />
          </Form.Item>
          <Form.Item label="空间限制">
            <Input
              type="number"
              value={judgeConfig.stackLimit}
              onChange={(e) => handleJudgeConfigChange("stackLimit", Number(e.target.value))}
            />
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Modal
      title="更新算法题目"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          提交
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={oldData}>
        <Tabs items={items} />
      </Form>
    </Modal>
  );
};

export default UpdateAlgorithmModal;