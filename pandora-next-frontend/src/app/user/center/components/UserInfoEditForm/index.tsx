import { Button, Form, Input, message, Select } from "antd";  // 添加 Select 导入
import { editUserUsingPost } from "@/api/userController";
import React from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/stores";
import loginUser, {setLoginUser} from "@/stores/loginUser";

interface Props {
  user: API.LoginUserVO;
}

/**
 * 用户信息编辑表单
 * @constructor
 */
const UserInfoEditForm = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [form] = Form.useForm();
  const { user } = props;
  // 将 JSON 字符串转换为数组
  const initialValues = {
    ...user,
    expertiseDirection: user.expertiseDirection ? JSON.parse(user.expertiseDirection.replace(/'/g, '"')) : []
  };
  form.setFieldsValue(initialValues);

  const doSubmit = async (values: API.UserEditRequest) => {
    const hide = message.loading("正在操作");
    try {
      // 将数组转换为 JSON 字符串
      const submitValues = {
        ...values,
        expertiseDirection: JSON.stringify(values.expertiseDirection)
      };
      await editUserUsingPost(submitValues);
      hide();
      message.success("操作成功");
      dispatch(setLoginUser({...user, ...submitValues}));
    } catch (error: any) {
      hide();
      message.error("操作失败，" + error.message);
    }
  };

  return (
    <Form
      form={form}
      style={{ marginTop: 24, maxWidth: 480 }}
      labelCol={{ span: 4 }}
      labelAlign="left"
      onFinish={doSubmit}
    >
      <Form.Item label="用户名" name="userName">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item label="手机号" name="phoneNumber">
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="邮箱" name="email">
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item label="年级" name="grade">
        <Input placeholder="请输入年级" />
      </Form.Item>
      <Form.Item label="工作经验" name="workExperience">
        <Input placeholder="请输入工作经验" />
      </Form.Item>
      <Form.Item label="擅长方向" name="expertiseDirection">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="请选择或输入擅长方向"
          options={[
            { value: 'Java', label: 'Java' },
            { value: 'Python', label: 'Python' },
            { value: 'C++', label: 'C++' },
            { value: '前端开发', label: '前端开发' },
            { value: '后端开发', label: '后端开发' },
            { value: '算法', label: '算法' },
            { value: '数据库', label: '数据库' },
          ]}
        />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: 180 }} type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserInfoEditForm;