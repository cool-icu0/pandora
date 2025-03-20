import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, Steps } from "antd";
import MdEditor from "@/components/MdEditor";
import { addQuestionUsingPost } from "@/api/questionCodeController";

const { Step } = Steps;

interface Props {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreateAlgorithmModal: React.FC<Props> = ({ visible, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [judgeCases, setJudgeCases] = useState<{ input: string; output: string }[]>([]);
  const [judgeConfig, setJudgeConfig] = useState<{ timeLimit: number; memoryLimit: number; stackLimit: number }>({
    timeLimit: 1000,
    memoryLimit: 1000,
    stackLimit: 1000,
  });

  const handleTagChange = (value: string[]) => {
    setTags(value);
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAddJudgeCase = () => {
    setJudgeCases([...judgeCases, { input: "", output: "" }]);
  };

  const handleJudgeCaseChange = (index: number, field: "input" | "output", value: string) => {
    const newJudgeCases = [...judgeCases];
    newJudgeCases[index][field] = value;
    setJudgeCases(newJudgeCases);
  };

  const handleJudgeConfigChange = (field: "timeLimit" | "memoryLimit" | "stackLimit", value: number) => {
    setJudgeConfig({ ...judgeConfig, [field]: value });
  };

  const handleOk = async () => {
    try {
      const allValues = {
        title,
        content,
        answer,
        tags: tags,
        judgeCase: judgeCases,
        judgeConfig: judgeConfig,
      };
      // console.log("allValues", allValues);
      // Call API to create algorithm question
      await addQuestionUsingPost(allValues);
      onSubmit();
    } catch (error) {
      console.error("Failed to create algorithm question:", error);
    }
  };

  const handleMdEditorChange = (value: string) => {
    setAnswer(value);
  };

  return (
    <Modal
      title="新建算法题目"
      visible={visible}
      onCancel={onCancel}
      footer={[
        currentStep > 0 && (
          <Button key="prev" onClick={handlePrev}>
            上一步
          </Button>
        ),
        currentStep < 2 ? (
          <Button key="next" type="primary" onClick={handleNext}>
            下一步
          </Button>
        ) : (
          <Button key="submit" type="primary" onClick={handleOk}>
            提交
          </Button>
        ),
      ]}
    >
      <Steps current={currentStep}>
        <Step title="基本信息" />
        <Step title="答案" />
        <Step title="判题信息" />
      </Steps>
      <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
        {currentStep === 0 && (
          <>
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: "请输入题目标题" }]}
            >
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: "请输入题目内容" }]}
            >
              <Input.TextArea rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
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
        )}
        {currentStep === 1 && (
          <Form.Item
            label="题目答案"
            name="answer"
            rules={[{ required: true, message: "请输入题目答案" }]}
          >
            <MdEditor value={answer} onChange={handleMdEditorChange} />
          </Form.Item>
        )}
        {currentStep === 2 && (
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
        )}
      </Form>
    </Modal>
  );
};

export default CreateAlgorithmModal;