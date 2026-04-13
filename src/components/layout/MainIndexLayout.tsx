import React from 'react';
import { Layout } from 'antd';
import SysMenuIndex from './sysmenu/SysMenuIndex';
import IndexHeader from './header/IndexHeader';
import ContentIndex from './content/ContentIndex';
import FooterIndex from './footer/FooterIndex';
import { useNavigate } from "react-router-dom";
//点击菜单
const MainIndexLayout: React.FC = () => {
  const navigate = useNavigate();
  const handleOnClick = (key: string) => {
    console.log('点击菜单key:', key);
    // 在这里根据key处理点击逻辑，比如路由跳转
    // 比如 react-router-dom 的 navigate(`/path/${key}`)
    navigate(`/main${key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SysMenuIndex handleOnClick={handleOnClick} />
      <Layout>
        <IndexHeader />
        <ContentIndex />
        <FooterIndex />
      </Layout>
    </Layout>
  );
};

export default MainIndexLayout;