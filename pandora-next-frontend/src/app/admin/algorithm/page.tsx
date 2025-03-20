"use client";
import React, { useState, useRef } from "react";
// 在顶部导入 Tabs 组件
import { Button, message, Space, Typography, Drawer, Tag, Divider, Table, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import CreateAlgorithmModal from "./components/CreateAlgorithmModal";
import UpdateAlgorithmModal from "./components/UpdateAlgorithmModal";
import {
  deleteQuestionCodeUsingPost,
  listQuestionCodeByPageUsingPost,
  batchDeleteQuestionCodeUsingPost,
  batchDownloadQuestionsUsingPost,
} from "@/api/questionCodeController";
import "./index.css";
import MdViewer from "@/components/MdViewer";
import axios from "axios";

const AlgorithmAdminPage: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.QuestionCode>();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerData, setDrawerData] = useState<API.QuestionCode | null>(null);

  const handleDelete = async (row: API.QuestionCode) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionCodeUsingPost({
        id: row.id as any,
      });
      hide();
      message.success("删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
      return false;
    }
  };

  // 修改批量删除处理函数
  const handleBatchDelete = async (selectedRows: API.QuestionCode[]) => {
    const hide = message.loading("正在批量删除");
    if (!selectedRows) return true;
    try {
      const ids = selectedRows.map(row => row.id);
      await batchDeleteQuestionCodeUsingPost({
        ids: ids as any[],
      });
      hide();
      message.success("批量删除成功");
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error("批量删除失败，" + error.message);
      return false;
    }
  };

  const handleBatchDownload = async (selectedRows: API.QuestionCode[]) => {
    console.log("要下载的ID列表：", selectedRows);
    // 在这里可以调用API或者其他方法来发送批量删除请求
    try {
        const response = await axios.post("http://localhost:8101/api/questionCode/batchDownload",
            selectedRows,{ responseType: "blob" }
        );
        console.log("当前代码格式", response);
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `算法题目集_${new Date().getTime()}.zip`);
        document.body.appendChild(link); 
        link.click();
        document.body.removeChild(link);
        message.success(`成功下载 ${selectedRows.length} 个题目`);
    } catch (error) {
        message.error("下载失败");
        console.error("Error downloading questions:", error);
    }
  };

  const columns: ProColumns<API.QuestionCode>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "标题",
      dataIndex: "title",
      valueType: "text",
    },
    {
      title: "内容",
      dataIndex: "content",
      valueType: "text",
      hideInSearch: true,
      width: 400,
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "text",
      width: 200,
      render: (_, record) => {
        const tags = record.tags ? JSON.parse(record.tags) : [];
        return (
          <Space>
            {tags.map((tag: string, index: number) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "更新时间",
      sorter: true,
      dataIndex: "updateTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setDrawerData(record);
              setDrawerVisible(true);
            }}
          >
            查看详情
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer className="algorithmAdminPage">
      <ProTable<API.QuestionCode>
        headerTitle={"算法题目管理"}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          pageSize: 6,
          pageSizeOptions: [6, 12, 24, 48],
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        // 修改 tableAlertOptionRender
        tableAlertOptionRender={({ selectedRows, onCleanSelected }) => (
          <Space size={16}>
            <Button
              danger
              onClick={async () => {
                await handleBatchDelete(selectedRows);
                onCleanSelected();
              }}
            >
              批量删除
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                await handleBatchDownload(selectedRows);
              }}
            >
              批量下载
            </Button>
          </Space>
        )}
        columns={columns}
        request={async (params, sort, filter) => {
          const res = await listQuestionCodeByPageUsingPost({
            ...params,
            ...filter,
          } as API.QuestionQueryRequest);
          return {
            success: (res as any).code === 0,
            data: (res.data as any)?.records || [],
            total: Number((res.data as any)?.total) || 0,
          };
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <CreateAlgorithmModal
        visible={createModalVisible}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateAlgorithmModal
        visible={updateModalVisible}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
      <Drawer
        title={<Typography.Title level={4}>算法题目详情</Typography.Title>}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
      >
        {drawerData && (
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: '基本信息',
                children: (
                  <Table
                    pagination={false}
                    dataSource={[
                      {
                        key: 'basic',
                        label: '基本信息',
                        value: (
                          <div>
                            <div><strong>ID:</strong> {drawerData.id}</div>
                            <div><strong>标题:</strong> {drawerData.title}</div>
                            <div>
                              <strong>标签:</strong>{" "}
                              {drawerData.tags && (
                                <Space>
                                  {JSON.parse(drawerData.tags).map((tag: string, index: number) => (
                                    <Tag key={index}>{tag}</Tag>
                                  ))}
                                </Space>
                              )}
                            </div>
                          </div>
                        )
                      },
                      {
                        key: 'stats',
                        label: '统计信息',
                        value: (
                          <div>
                            <div><strong>提交次数:</strong> {drawerData.submitNum}</div>
                            <div><strong>通过次数:</strong> {drawerData.acceptedNum}</div>
                            <div><strong>通过率:</strong> {drawerData.submitNum ? (((drawerData as any).acceptedNum / drawerData.submitNum) * 100).toFixed(1) : 0}%</div>
                            <div><strong>点赞数:</strong> {drawerData.thumbNum}</div>
                            <div><strong>收藏数:</strong> {drawerData.favourNum}</div>
                          </div>
                        )
                      },
                      {
                        key: 'time',
                        label: '时间信息',
                        value: (
                          <div>
                            <div><strong>创建时间:</strong> {new Date((drawerData as any).createTime).toLocaleString('zh-CN')}</div>
                            <div><strong>更新时间:</strong> {new Date((drawerData as any).updateTime).toLocaleString('zh-CN')}</div>
                          </div>
                        )
                      },
                    ]}
                    columns={[
                      {
                        title: '项目',
                        dataIndex: 'label',
                        key: 'label',
                        width: 150,
                      },
                      {
                        title: '内容',
                        dataIndex: 'value',
                        key: 'value',
                      },
                    ]}
                  />
                ),
              },
              {
                key: '2',
                label: '题目内容',
                children: (
                  <>
                    <MdViewer value={drawerData.content} />
                    <Typography.Title level={5} style={{ marginTop: 24 }}>判题配置</Typography.Title>
                    {drawerData.judgeConfig && (
                      <Table
                        pagination={false}
                        dataSource={[
                          {
                            key: 'config',
                            label: '判题配置',
                            value: (
                              <div>
                                <div><strong>时间限制:</strong> {JSON.parse(drawerData.judgeConfig).timeLimit} ms</div>
                                <div><strong>内存限制:</strong> {JSON.parse(drawerData.judgeConfig).memoryLimit} MB</div>
                                <div><strong>空间限制:</strong> {JSON.parse(drawerData.judgeConfig).stackLimit} MB</div>
                              </div>
                            )
                          }
                        ]}
                        columns={[
                          {
                            title: '项目',
                            dataIndex: 'label',
                            key: 'label',
                            width: 150,
                          },
                          {
                            title: '内容',
                            dataIndex: 'value',
                            key: 'value',
                          },
                        ]}
                      />
                    )}
                    <Typography.Title level={5} style={{ marginTop: 24 }}>判题用例</Typography.Title>
                    {drawerData.judgeCase && (
                      <Table
                        pagination={false}
                        dataSource={JSON.parse(drawerData.judgeCase).map((item: any, index: number) => ({
                          key: index,
                          input: item.input,
                          output: item.output,
                        }))}
                        columns={[
                          {
                            title: '输入',
                            dataIndex: 'input',
                            key: 'input',
                          },
                          {
                            title: '输出',
                            dataIndex: 'output',
                            key: 'output',
                          },
                        ]}
                      />
                    )}
                  </>
                ),
              },
              {
                key: '3',
                label: '题目答案',
                children: <MdViewer value={drawerData.answer} />,
              },
              // 删除原来的判题信息标签页
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AlgorithmAdminPage;