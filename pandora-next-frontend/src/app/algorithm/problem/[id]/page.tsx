'use client';

import { useEffect, useState } from 'react';
import { Card, Tag, Space, Button, message, Select, Modal } from 'antd';
import { LikeFilled, StarFilled, EditOutlined } from '@ant-design/icons';
import { getQuestionCodeByIdUsingGet, doQuestionCodeSubmitUsingPost, getQuestionCodeSubmitByIdUsingGet, doQuestionCodeRunUsingPost } from '@/api/questionCodeController';
import MdViewer from '@/components/MdViewer';
import CodeEditor from '@/components/CodeEditor';
import { BorderHorizontalOutlined, BorderVerticleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import RunResultModal from './components/RunResultModal';
import EditTestCaseModal from './components/EditTestCaseModal';
import SubmitResultModal from './components/SubmitResultModal';

const { Title } = Typography;

import './index.css';

import { PlayCircleOutlined, CloudUploadOutlined } from '@ant-design/icons';

export default function ProblemDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState<API.QuestionCodeVO>();
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);
  const [code, setCode] = useState('');
  // 添加运行相关状态
  const [runModalVisible, setRunModalVisible] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [runResults, setRunResults] = useState<any[]>([]);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [executionTime, setExecutionTime] = useState(0);
  const [runStatus, setRunStatus] = useState<'success' | 'error' | 'pending'>('pending');
  const [currentTestCases, setCurrentTestCases] = useState<any[]>([]);
  
  // 添加测试用例相关状态
  const [editTestCaseModalVisible, setEditTestCaseModalVisible] = useState(false);
  const [customTestCases, setCustomTestCases] = useState<any[]>([]);
  const [useCustomTestCases, setUseCustomTestCases] = useState(false);
  
  // 添加提交相关状态
  const [submitting, setSubmitting] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);
  
  // 添加窗口大小变化监听
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsVerticalLayout(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化时执行一次
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const templateCode = {
    java: `public class Solution {
    public static void main(String[] args) {
        // 在这里编写你的代码
    }
}`,
    python: `def solution():
    # 在这里编写你的代码
    pass

if __name__ == "__main__":
    solution()`
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setCode(templateCode[value as keyof typeof templateCode]);
  };

  const handleReset = () => {
    setCode(templateCode[selectedLanguage as keyof typeof templateCode]);
  };

  // 处理测试用例编辑
  const handleEditTestCase = () => {
    // 如果还没有自定义测试用例，使用原始测试用例
    if (customTestCases.length === 0 && (problem as any)?.judgeCase) {
      try {
        const originalTestCases = JSON.parse(typeof (problem as any).judgeCase === 'string' ? (problem as any).judgeCase : '[]');
        setCustomTestCases(originalTestCases);
      } catch (error) {
        setCustomTestCases([{ input: '', output: '' }]);
      }
    }
    setEditTestCaseModalVisible(true);
  };

  // 保存自定义测试用例
  const handleSaveTestCases = (testCases: any[]) => {
    setCustomTestCases(testCases);
    setUseCustomTestCases(true);
    setCurrentTestCases(testCases); // 更新当前测试用例
    message.success('测试用例已更新');
  };

  useEffect(() => {
    // 初始化时设置默认测试用例
    if (problem?.judgeCase) {
      try {
        const defaultTestCases = JSON.parse(typeof problem.judgeCase === 'string' ? problem.judgeCase : '[]');
        setCurrentTestCases(defaultTestCases);
      } catch (error) {
        setCurrentTestCases([{ input: '', output: '' }]);
      }
    }
  }, [problem]);

  // 修改运行代码的函数
  const handleRunCode = async () => {
    if (!code.trim()) {
      message.error('请先编写代码');
      return;
    }

    if (!problem?.id) {
      message.error('题目信息不完整');
      return;
    }

    // 确定使用哪些测试用例
    let testCases;
    if (useCustomTestCases && customTestCases.length > 0) {
      testCases = customTestCases;
    } else if ((problem as any)?.judgeCase) {
      try {
        testCases = JSON.parse(typeof (problem as any).judgeCase === 'string' ? (problem as any).judgeCase : '[]');
      } catch (error) {
        message.error('测试用例格式错误');
        return;
      }
    } else {
      message.error('没有可用的测试用例');
      return;
    }

    if (!testCases || testCases.length === 0) {
      message.error('没有可用的测试用例');
      return;
    }

    setRunModalVisible(true);
    setRunLoading(true);
    setActiveTabKey('1');
    setRunStatus('pending');
    setRunResults([]);

    try {
      // 调用后端API运行代码
      const runParams = {
        submitCode: code,
        submitLanguage: selectedLanguage,
        questionId: problem.id
      };
      
      const res = await doQuestionCodeRunUsingPost(runParams);
      
      if ((res as any).code === 0) {
        // 运行请求成功，获取运行结果
        const runId = (res as any).data;
        
        // 获取运行结果详情
        const runResultRes = await getQuestionCodeSubmitByIdUsingGet({
          questionSubmitId: runId
        });
        
        if ((runResultRes as any).code === 0) {
          const resultData = (runResultRes as any).data;
          
          // 解析判题信息
          let judgeInfo = {
            time:0,
            message: '',
            memory:0,
          };
          try {
            judgeInfo = typeof resultData.judgeInfo === 'string' 
              ? JSON.parse(resultData.judgeInfo) 
              : (resultData.judgeInfo || {});
          } catch (e) {
            judgeInfo = {
              time:0,
              message: '',
              memory:0,
            };
          }
        
          
          // 设置运行状态和结果
          const allPassed = judgeInfo.message === '成功';
          setRunStatus(allPassed ? 'success' : 'error');
          setRunResults(currentTestCases);
          setExecutionTime(judgeInfo.time || 0);
        } else {
          message.error('获取运行结果失败：' + (runResultRes as any).message);
          setRunStatus('error');
        }
      } else {
        message.error((res as any).message || '运行失败');
        setRunStatus('error');
      }
    } catch (error: any) {
      console.error('运行代码出错:', error);
      message.error('运行失败，请稍后重试：' + (error.message || '未知错误'));
      setRunStatus('error');
    } finally {
      setRunLoading(false);
    }
  };

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const res = await getQuestionCodeByIdUsingGet({ id: params.id });
      if ((res as any).code === 0 && res.data) {
        const data = (res as any).data;
        const judgeCase = data.judgeCase ? JSON.parse(data.judgeCase).map((item: any, index: number) => (
          `测试用例 ${index + 1}:
输入：${item.input}
输出：${item.output}
`
        )).join('\n') : '';

        // 解析判题配置
        let judgeConfigInfo = '';
        if (data.judgeConfig) {
          try {
            const config = JSON.parse(data.judgeConfig);
            judgeConfigInfo = `### 判题配置
- 时间限制: ${config.timeLimit || 0} ms
- 内存限制: ${config.memoryLimit || 0} MB
- 栈限制: ${config.stackLimit || 0} KB
`;
          } catch (e) {
            judgeConfigInfo = '';
          }
        }

        data.content = `${data.content || ''}

${judgeConfigInfo}
### 判题用例
\`\`\`
${judgeCase}
\`\`\``;
        setProblem(data);
      } else {
        message.error('获取题目详情失败');
      }
    } catch (error:any) {
      message.error('获取题目详情接口失败',error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const renderProblemInfo = () => {
    if (!problem) return null;

    const acceptanceRate = (((problem.acceptedNum || 0) / (problem.submitNum || 1)) * 100);
    let color = '';
    let level = '';
    
    if (acceptanceRate <= 30) {
      color = '#f50';
      level = '极难';
    } else if (acceptanceRate <= 50) {
      color = '#ff4d4f';
      level = '困难';
    } else if (acceptanceRate <= 70) {
      color = '#faad14';
      level = '中等';
    } else if (acceptanceRate <= 85) {
      color = '#1890ff';
      level = '初级';
    } else {
      color = '#52c41a';
      level = '简单';
    }

    return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="problem-info-container">
            <div className="problem-header">
                <h1 className="problem-title">{problem.title}</h1>
                <div className="tag-container">
                <Tag color={color}>{level}</Tag>
                {(typeof problem.tags === 'string' ? JSON.parse(problem.tags) : problem.tags || []).map((tag:any) => (
                    <Tag key={tag}>{tag}</Tag>
                ))}
                </div>
            </div>

            <div className="stats-container">
                <div className="stats-group">
                    <div className="stat-item">
                        <span className="stat-label">提交次数</span>
                        <span className="stat-value">{problem.submitNum || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">通过次数</span>
                        <span className="stat-value">{problem.acceptedNum || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">通过率</span>
                        <span className="stat-value">{acceptanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="interaction-stats">
                        <Space>
                            <LikeFilled /> {problem.thumbNum || 0}
                        </Space>
                        <Space>
                            <StarFilled /> {problem.favourNum || 0}
                        </Space>
                    </div>
                </div>
            </div>
            <div className="layout-switch" style={{ marginTop: '16px', textAlign: 'right' }}>
                <Button
                    icon={isVerticalLayout ? <BorderVerticleOutlined /> : <BorderHorizontalOutlined />}
                    onClick={() => setIsVerticalLayout(!isVerticalLayout)}
                >
                    {isVerticalLayout ? '上下排列' : '左右排列'}
                </Button>
            </div>
        </div>
    </Space>
    );
  };

  // 修改提交代码的函数，添加跳转逻辑
  const handleSubmitCode = async () => {
    if (!code.trim()) {
      message.error('请先编写代码');
      return;
    }

    if (!problem?.id) {
      message.error('题目信息不完整');
      return;
    }

    try {
      setSubmitting(true);
      
      const submitParams = {
        submitCode: code,
        submitLanguage: selectedLanguage,
        questionId: problem.id
      };
      
      const res = await doQuestionCodeSubmitUsingPost(submitParams);
      
      if ((res as any).code === 0) {
        message.success('提交成功');
        // 提交成功后,获取提交结果并打开模态框
        try {
          const submitId = (res as any).data;
          // 获取提交结果详情
          const submitResultRes = await getQuestionCodeSubmitByIdUsingGet({
            questionSubmitId: submitId
          });
          
          if ((submitResultRes as any).code === 0) {
            // 设置提交结果并显示模态框
            setSubmitResult({
              ...submitResultRes.data,
              submitId
            });
            setSubmitModalVisible(true);
          } else {
            message.error('获取提交结果失败：' + (submitResultRes as any).message);
          }
        } catch (error: any) {
          console.error('获取提交结果失败:', error);
          message.error('获取提交结果失败：' + (error.message || '未知错误'));
        }
      } else {
        message.error((res as any).message || '提交失败');
      }
    } catch (e:any) {
      console.error('提交代码出错:', e.message);
      message.error(`提交失败，请稍后重试：${e.message || '未知错误'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="problem-detail" style={{ padding: '24px', background: '#f7f9fc' }}>
        {renderProblemInfo()}
        <Card loading={loading} bordered={false} style={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div className={`problem-content ${isVerticalLayout ? 'vertical' : 'horizontal'}`}>
                <Card className="description-card" bordered={false} style={{ 
                    borderRadius: '12px',
                    background: '#fff',
                    padding: '24px'
                }}>
                    <Title level={4} style={{ marginBottom: '20px', color: '#1a1a1a' }}>题目描述</Title>
                    <MdViewer value={problem?.content || ''} />
                </Card>
                <Card className="code-card" bordered={false} style={{ 
                    borderRadius: '12px',
                    background: '#fff',
                    padding: '24px'
                }}>
                    <div className="language-selector" style={{
                        background: '#f8f9fa',
                        padding: '16px 24px',
                        borderRadius: '12px',
                        marginBottom: '24px'
                    }}>
                        <div className="language-controls">
                            <Title level={5} style={{ margin: 0, color: '#1a1a1a' }}>选择语言：</Title>
                            <Select
                                value={selectedLanguage}
                                onChange={handleLanguageChange}
                                style={{ 
                                    width: '100%',
                                    maxWidth: '200px',
                                    borderRadius: '8px'
                                }}
                                size="large"
                                options={[
                                    { value: 'java', label: 'Java' },
                                    { value: 'python', label: 'Python' },
                                ]}
                                dropdownStyle={{ borderRadius: '8px' }}
                            />
                            <Button 
                                onClick={handleReset} 
                                style={{ 
                                    borderRadius: '8px',
                                    height: '40px',
                                    background: '#f0f2f5',
                                    border: 'none',
                                    color: '#1a1a1a',
                                    fontWeight: 500
                                }}
                            >
                                重置代码
                            </Button>
                        </div>
                    </div>
                    <Title level={4} style={{ marginBottom: '20px', color: '#1a1a1a' }}>编写代码</Title>
                    <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <CodeEditor
                            value={code || templateCode[selectedLanguage as keyof typeof templateCode]}
                            onChange={setCode}
                            language={selectedLanguage}
                        />
                    </div>
                    <div className="action-bar">
                        <Button 
                            icon={<EditOutlined />}
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                background: '#f0f2f5',
                                border: 'none',
                                padding: '0 24px',
                                marginRight: '8px'
                            }}
                            onClick={handleEditTestCase}
                        >
                            修改测试用例
                        </Button>
                        <Button 
                            icon={<PlayCircleOutlined />} // 修改运行按钮图标
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                background: '#f0f2f5',
                                border: 'none',
                                padding: '0 24px'
                            }}
                            onClick={handleRunCode}
                        >
                            运行
                        </Button>
                        <Button 
                            icon={<CloudUploadOutlined />} // 修改提交按钮图标
                            type="primary" 
                            style={{
                                borderRadius: '8px',
                                height: '40px',
                                background: '#52c41a',
                                padding: '0 24px',
                                fontWeight: 500
                            }}
                            onClick={handleSubmitCode}
                            loading={submitting}
                        >
                            提交
                        </Button>
                    </div>
                </Card>
            </div>
        </Card>

        {/* 使用抽离出的运行结果模态框组件 */}
        <RunResultModal
          visible={runModalVisible}
          onClose={() => setRunModalVisible(false)}
          loading={runLoading}
          results={runResults}
          status={runStatus}
          executionTime={executionTime}
          activeTabKey={activeTabKey}
          setActiveTabKey={setActiveTabKey}
        />
        
        {/* 添加测试用例编辑模态框 */}
        <EditTestCaseModal
          visible={editTestCaseModalVisible}
          onClose={() => setEditTestCaseModalVisible(false)}
          onSave={handleSaveTestCases}
          initialTestCases={customTestCases}
        />
        
        {/* 添加提交结果模态框 */}
        <SubmitResultModal
          visible={submitModalVisible}
          onClose={() => setSubmitModalVisible(false)}
          submitResult={submitResult}
          onViewSubmissions={() => {
            window.location.href = '/algorithm/submissions';
          }}
        />
    </div>
  );
};