"use client";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Table, Typography,Drawer } from "antd";
import React, { useRef, useState } from "react";
import TagList from "@/components/TagList";
import UpdateBankModal from "@/app/admin/question/components/UpdateBankModal";
import "./index.css";
import {
  batchDeleteQuestionsUsingPost,
} from "@/api/questionController";
import BatchAddQuestionsToBankModal from "./components/BatchAddQuestionsToBankModal";
import BatchRemoveQuestionFromBankModal from "./components/BatchRemoveQuestionsFromBankModal";

/**
 * 题目管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示更新所属题库窗口
  const [updateBankModalVisible, setUpdateBankModalVisible] =
    useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前题目点击的数据
  const [currentRow, setCurrentRow] = useState<API.Question>();
  // 是否显示 Drawer
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false); // 控制 Drawer 显示状态
  const [drawerData, setDrawerData] = useState<API.Question | null>(null); // 存储 Drawer 中显示的数据

  // 是否显示批量向题库添加题目弹窗
  const [
    batchAddQuestionsToBankModalVisible,
    setBatchAddQuestionsToBankModalVisible,
  ] = useState<boolean>(false);
// 是否显示批量从题库移除题目弹窗
  const [
    batchRemoveQuestionsFromBankModalVisible,
    setBatchRemoveQuestionsFromBankModalVisible,
  ] = useState<boolean>(false);
// 当前选中的题目 id 列表
  const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
      number[]
  >([]);

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Question) => {
    const hide = message.loading("正在删除");
    if (!row) return true;
    try {
      await deleteQuestionUsingPost({
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
  /**
   * 批量删除
   * @param questionIdList
   */
  const handleBatchDelete = async (questionIdList: number[]) => {
    const hide = message.loading("正在操作");
    try {
      await batchDeleteQuestionsUsingPost({
        questionIdList,
      });
      hide();
      message.success("操作成功");
      actionRef?.current?.reload();
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.Question>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "所属题库",
      dataIndex: "questionBankId",
      hideInTable: true,
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
      width: 240,
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      fieldProps: {
        mode: "tags",
      },
      render: (_, record) => {
        const tagList = JSON.parse(record.tags || "[]");
        return <TagList tagList={tagList} />;
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
          <Popconfirm
            title="选择操作"
            description={
              <Space direction="horizontal">
                <Button
                  onClick={() => {
                    setCurrentRow(record);
                    setUpdateModalVisible(true);
                  }}
                >
                  修改题目内容
                </Button>
                <Button
                  onClick={() => {
                    setCurrentRow(record);
                    setUpdateBankModalVisible(true);
                  }}
                >
                  修改所属题库
                </Button>
              </Space>
            }
            okText="关闭"
            cancelText=""
            showCancel={false}
          >
            <Typography.Link>修改</Typography.Link>
          </Popconfirm>
          <Typography.Link
            onClick={() => {
              setDrawerData(record);
              setDrawerVisible(true);
            }}
          >
            查看详情
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer className="questionAdminPage"> {/* 使用类名替代内联样式 */}
      <ProTable<API.Question>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        scroll={{
          x: true,
        }}
        search={{
          labelWidth: 120,
        }}
        rowKey="id"
        pagination={{
          pageSize: 6, // 设置默认每页显示8条数据
          pageSizeOptions: ['6', '12', '18', '24','30'], // 可选择的每页显示数量
          showSizeChanger: true, // 显示每页数量选择器
        }}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          return (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          return (
            <Space size={16}>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchAddQuestionsToBankModalVisible(true);
                }}
              >
                批量向题库添加题目
              </Button>
              <Button
                onClick={() => {
                  // 打开弹窗
                  setSelectedQuestionIdList(selectedRowKeys as number[]);
                  setBatchRemoveQuestionsFromBankModalVisible(true);
                }}
              >
                批量从题库移除题目
              </Button>
              <Popconfirm
                title="确认删除"
                description="你确定要删除这些题目么？"
                onConfirm={() => {
                  // 批量删除题目
                  handleBatchDelete(selectedRowKeys as number[]);
                }}
                okText="确认"
                cancelText="取消"
              >
                <Button danger>批量删除题目</Button>
              </Popconfirm>
            </Space>
          );
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            ghost
            key="primary"
            href="/admin/question/ai"
            target="_blank"
          >
            <PlusOutlined /> AI 生成题目
          </Button>,
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
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const res = await listQuestionByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.QuestionQueryRequest);
          return {
            success: (res as any).code === 0,
            data: (res.data as any)?.records || [],
            total: Number((res.data as any)?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
      <UpdateBankModal
        visible={updateBankModalVisible}
        questionId={currentRow?.id}
        onCancel={() => {
          setUpdateBankModalVisible(false);
        }}
      />
      <BatchAddQuestionsToBankModal
          visible={batchAddQuestionsToBankModalVisible}
          questionIdList={selectedQuestionIdList}
          onSubmit={() => {
            setBatchAddQuestionsToBankModalVisible(false);
          }}
          onCancel={() => {
            setBatchAddQuestionsToBankModalVisible(false);
          }}
      />
      <BatchRemoveQuestionFromBankModal
          visible={batchRemoveQuestionsFromBankModalVisible}
          questionIdList={selectedQuestionIdList}
          onSubmit={() => {
            setBatchRemoveQuestionsFromBankModalVisible(false);
          }}
          onCancel={() => {
            setBatchRemoveQuestionsFromBankModalVisible(false);
          }}
      />
      <Drawer
        title={<Typography.Title level={4}>题目详情</Typography.Title>}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
      >
        {drawerData && (
          <div className="drawerContent"> {/* 使用类名替代内联样式 */}
            <Typography.Paragraph>
              <strong>ID:</strong> {drawerData.id}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>标题:</strong> {drawerData.title}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>内容:</strong> {drawerData.content}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>答案:</strong> {drawerData.answer}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>标签:</strong> {drawerData.tags}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>创建用户:</strong> {drawerData.userId}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>创建时间:</strong> {drawerData.createTime}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>编辑时间:</strong> {drawerData.editTime}
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>更新时间:</strong> {drawerData.updateTime}
            </Typography.Paragraph>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default QuestionAdminPage;
