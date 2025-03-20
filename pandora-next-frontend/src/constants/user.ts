import ACCESS_ENUM from "@/access/accessEnum";

// 默认用户
export const DEFAULT_USER: API.LoginUserVO = {
  userName: "未登录",
  userProfile: "暂无简介",
  userAvatar: "/assets/notLoginUser.png",
  userRole: ACCESS_ENUM.NOT_LOGIN,
};

// 用户角色枚举
export const USER_ROLE_ENUM = {
  USER: "user",
  ADMIN: "admin",
};

// 用户角色 => 文本映射
export const USER_ROLE_TEXT_MAP = {
  user: "普通用户",
  admin: "管理员",
};
