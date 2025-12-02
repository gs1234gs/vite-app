import React, { useEffect, useState } from "react";
import { Header } from "antd/es/layout/layout";
import { theme, Dropdown, Avatar, Space, Typography, message,type MenuProps } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { cacheSession } from "../../../../utils/cache";
import { SYSTEM_MENU_BAR_CONST_KEY } from "../../../../const/SiderBarConst";
import { SIGN_IN_CONST_ID, SIGN_IN_CONST_TOKEN } from "../../../../const/SignInConst";
import useSysUser from "../../../../stores/main/SysUser";

const { Text } = Typography;

const IndexHeader: React.FC = () => {
  const [avatar,setAvatar] = useState<any>()
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 显式声明类型，避免类型不匹配
  const menuItems: MenuProps['items'] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      type: "divider" as const, // 关键写法，告诉TS这是个分割线
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];
const {findSignInUserByIdApi} = useSysUser()
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await findSignInUserByIdApi();
       setAvatar(res);
      // console.log('用户信息:', res);
      // 可以 setState 或 dispatch 到全局状态
    } catch (error) {
      console.error('获取用户失败:', error);
    }
  };

  fetchUser();
}, [findSignInUserByIdApi]);
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case "profile":
        message.info("跳转到个人资料页");
        break;
      case "settings":
        message.info("跳转到设置页");
        break;
      case "logout":
        message.info("退出登录");
        navigate("/sign-in");

         cacheSession.removeCache(SYSTEM_MENU_BAR_CONST_KEY)
        cacheSession.removeCache(SIGN_IN_CONST_TOKEN)
        cacheSession.removeCache(SIGN_IN_CONST_ID)
        cacheSession.clearCache()
        break;
    }
  };

  return (
    <Header
      style={{
        padding: "0 24px",
        background: colorBgContainer,
        position: "sticky",
        top: 0,
        zIndex: 1,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} placement="bottomRight" trigger={["click", "hover"]}>
        <Space style={{ cursor: "pointer" }}>
         <Avatar src={avatar?.image} />
          <Text>个人管理</Text>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default IndexHeader;
