"use client";
import { LogoutOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
// 在顶部导入 ConfigProvider 和 theme
import { Dropdown, message, Button, ConfigProvider, theme } from "antd";
const { defaultAlgorithm, darkAlgorithm } = theme;
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import GlobalFooter from "@/components/GlobalFooter";
import { menus } from "../../../config/menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores";
import getAccessibleMenus from "@/access/menuAccess";
import { userLogoutUsingPost } from "@/api/userController";
import { setLoginUser } from "@/stores/loginUser";
import { DEFAULT_USER } from "@/constants/user";
import SearchInput from "@/layouts/BasicLayout/components/SearchInput";
import "./index.css";

interface Props {
  children: React.ReactNode;
}

/**
 * 全局通用布局
 * @param children
 * @constructor
 */
export default function BasicLayout({ children }: Props) {
  const pathname = usePathname();
  const loginUser = useSelector((state: RootState) => state.loginUser);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  // 修改主题状态管理
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // 添加主题切换效果
  React.useEffect(() => {
    document.body.setAttribute('theme-mode', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /**
   * 用户注销
   */
  const userLogout = async () => {
    try {
      await userLogoutUsingPost();
      message.success("已退出登录");
      dispatch(setLoginUser(DEFAULT_USER));
      router.push("/user/login");
    } catch (e:any) {
      message.error("操作失败，" + e.message);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <div
        id="basicLayout"
        style={{
          height: "100vh",
          overflow: "auto",
          background: isDarkMode ? '#141414' : '#f0f2f5',
        }}
      >
        <ProLayout
          title="智能刷题平台"
          layout="top"
          logo={
            <Image
              src="/assets/logo.png"
              height={32}
              width={32}
              alt="logo"
            />
          }
          location={{
            pathname,
          }}
          avatarProps={{
            src: loginUser.userAvatar || "/assets/notLoginUser.png",
            size: "small",
            title: loginUser.userName || "未登录",
            render: (props, dom) => {
              if (!loginUser.id) {
                return (
                  <div
                    onClick={() => {
                      router.push("/user/login");
                    }}
                  >
                    {dom}
                  </div>
                );
              }
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "userCenter",
                        icon: <UserOutlined />,
                        label: "个人中心",
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: "退出登录",
                      },
                    ],
                    onClick: async (event: { key: React.Key }) => {
                      const { key } = event;
                      if (key === "logout") {
                        userLogout();
                      } else if (key === "userCenter") {
                        router.push("/user/center");
                      }
                    },
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          actionsRender={(props) => {
            if (props.isMobile) return [];
            return [
              <SearchInput key="search" />,
              <Button
                key="theme"
                type="text"
                icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ margin: '0 24px' }}
              />,
            ];
          }}
          headerTitleRender={(logo, title, _) => {
            return (
              <a>
                {logo}
                {title}
              </a>
            );
          }}
          // 渲染底部栏
          footerRender={() => {
            return <GlobalFooter />;
          }}
          onMenuHeaderClick={(e) => console.log(e)}
          // 定义有哪些菜单
          menuDataRender={() => {
            return getAccessibleMenus(loginUser, menus);
          }}
          // 定义了菜单项如何渲染
          menuItemRender={(item, dom) => (
            <Link href={item.path || "/"} target={item.target}>
              {dom}
            </Link>
          )}
        >
          {children}
        </ProLayout>
      </div>
    </ConfigProvider>
  );
}
