import { MenuDataItem } from "@ant-design/pro-layout";
import { CrownOutlined } from "@ant-design/icons";
import ACCESS_ENUM from "@/access/accessEnum";

// 菜单列表
export const menus = [
  {
    path: "/",
    name: "主页",
  },
  {
    path: "/forum",
    name:"讨论"
  },
  {
    path: "/interview",
    name: "面试刷题",
    children: [
      {
        path: "/interview/",
        name: "面试大全",
      },
      {
        path: "/interview/questions",
        name: "面试题目",
      },
      {
        path: "/interview/banks",
        name: "面试题库",
      },
    ],
  },

  {
    path: "/algorithm",
    name: "算法刷题",
    children: [
      {
        path: "/algorithm/problems",
        name: "题目列表",
      },
      {
        path: "/algorithm/submissions",
        name: "提交记录",
      }
    ]
  },

  {
    path: "/mockInterview",
    name: "模拟面试",
    icon: <CrownOutlined/>,
    children:[
      {
        path: "/mockInterview/add",
        name: "AI 模拟面试",
      },
      {
        path: "/mockInterview/list",
        name: "面试列表",
      }
    ]
  },
  {
    path: "/admin",
    name: "管理",
    icon: <CrownOutlined />,
    access: ACCESS_ENUM.ADMIN,
    children: [
      {
        path: "/admin/user",
        name: "刷题用户管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/bank",
        name: "面试题库管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/question",
        name: "面试题目管理",
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/algorithm",
        name: "算法题目管理",
        access: ACCESS_ENUM.ADMIN,
      },
    ],
  },
] as MenuDataItem[];

// 根据全部路径查找菜单
export const findAllMenuItemByPath = (path: string): MenuDataItem | null => {
  return findMenuItemByPath(menus, path);
};

// 根据路径查找菜单（递归）
export const findMenuItemByPath = (
  menus: MenuDataItem[],
  path: string,
): MenuDataItem | null => {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const matchedMenuItem = findMenuItemByPath(menu.children, path);
      if (matchedMenuItem) {
        return matchedMenuItem;
      }
    }
  }
  return null;
};
