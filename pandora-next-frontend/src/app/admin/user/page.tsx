"use client";
import { PageContainer, ProColumns } from "@ant-design/pro-components";
import React, { useRef, useState } from "react";
import { ActionType, ProTable } from "@ant-design/pro-table";
import { Button, message, Modal, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import CreateModal from "@/app/admin/user/components/CreateModal";
import UpdateModal from "@/app/admin/user/components/UpdateModal";

/**
 * 用户管理页面
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.User>();
  //删除的数据
  const [deletingRow, setDeletingRow] = useState<API.User | null>(null);
  /**
   * 删除节点
   * @param row
   */
  const handleDelete = async (row: API.User) => {
    setDeletingRow(row);
    // 显示确认对话框
  };
  const confirmDelete = async () => {
    const hide = message.loading("正在删除");
    try {
      await deleteUserUsingPost({
        id: deletingRow?.id as any,
      });
      hide();
      message.success("删除成功");
      actionRef.current?.reload();
    } catch (error: any) {
      hide();
      message.error("删除失败，" + error.message);
    } finally {
      setDeletingRow(null);
    }
  };

  const cancelDelete = () => {
    setDeletingRow(null);
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.User>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "账号",
      dataIndex: "userAccount",
      valueType: "text",
    },
    {
      title: "用户名",
      dataIndex: "userName",
      valueType: "text",
    },
    {
      title: "头像",
      dataIndex: "userAvatar",
      valueType: "image",
      fieldProps: {
        width: 64,
      },
      hideInSearch: true,
    },
    {
      title: "简介",
      dataIndex: "userProfile",
      valueType: "textarea",
    },
    {
      title: "邮箱",
      dataIndex: "userEmail",
      valueType: "text",
    },
    {
      title: "手机号",
      dataIndex: "userPhone",
      valueType: "text",
    },
    // {
    //   title: "分享码",
    //   dataIndex: "shareCode",
    //   valueType: "text",
    // },
    // {
    //   title: "邀请用户id",
    //   dataIndex: "inviteUser",
    //   valueType: "text",
    // },
    // {
    //   title: "会员编号",
    //   dataIndex: "vipNumber",
    //   valueType: "text",
    // },
    // {
    //   title: "会员过期时间",
    //   dataIndex: "vipExpireTime",
    //   valueType: "dateTime",
    // },
    // {
    //   title: "会员码",
    //   dataIndex: "vipCode",
    //   valueType: "text",
    // },
    {
      title: "权限",
      dataIndex: "userRole",
      valueEnum: {
        user: {
          text: "用户",
        },
        vip: {
          text: "会员",
        },
        admin: {
          text: "管理员",
        },
      },
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
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
      valueType: "option",
      dataIndex: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link>查看</Typography.Link>
          <Typography.Link
            type="success"
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            编辑
          </Typography.Link>
          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.User>
        headerTitle={"查询表格"}
        actionRef={actionRef}
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
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const { data, code } = await listUserByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);

          return {
            success: code === 0,
            data: (data as any)?.records || [],
            total: Number((data as any)?.total) || 0,
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
      {deletingRow && (
        <Modal
          title="确认删除"
          visible
          onOk={confirmDelete}
          onCancel={cancelDelete}
        >
          您确定要删除这个用户吗？
        </Modal>
      )}
    </PageContainer>
  );
};
export default UserAdminPage;
