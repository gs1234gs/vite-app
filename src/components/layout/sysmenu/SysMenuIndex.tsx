import {  Menu, Space, Switch, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import * as Icons from '@ant-design/icons';
import { useEffect, useState, useMemo } from "react";
import type { MenuProps } from 'antd';
import useSiderBar from "@/stores/main/SysMenu";
import { useLocation } from "react-router-dom";
type MenuItem = Required<MenuProps>['items'][number];
const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };
  
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };
  
  // 正确的递归构建 MenuItem[]
  const buildMenuItems = (menus: any[]): MenuItem[] => {
    if (!Array.isArray(menus)) {
      console.error('menus 不是数组！实际值：', menus);
      return [];
    }
    
    return menus.map((item) => ({
      key: item.path,
      label: item.name,
      icon: getIcon(item.icon),
      children: item.children?.length > 0 ? buildMenuItems(item.children) : undefined,
    }));
  };

const SysMenuIndex = ({handleOnClick} : any) => { 
      const [collapsed, setCollapsed] = useState(false);
       const [menuTheme, setMenuTheme] = useState<'light' | 'dark'>('light');
      const { dataSysMenu } = useSiderBar();
      
      // 根据路径查找对应的 permCode
      const normalizePath = (path: string) => path.startsWith('/main') ? path.slice(5) : path;

      const findKeyByPath = (menus: any[], path: string): string | undefined => {
        const normalizedPath = normalizePath(path);
        for (const menu of menus) {
          if (menu.path === normalizedPath) {
            return menu.path;
          }
          if (menu.children && menu.children.length) {
            const childKey = findKeyByPath(menu.children, normalizedPath);
            if (childKey) return childKey;
          }
        }
        return undefined;
      };

      // 递归查找选中节点的父级路径
      const findParentKeys = (menus: any[], target: string, parents: string[] = []): string[] | null => {
        for (const menu of menus) {
          if (menu.path === target) {
            return parents; // 找到目标，返回父级链
          }
          if (menu.children && menu.children.length > 0) {
            const result = findParentKeys(menu.children, target, [...parents, menu.path]);
            if (result) return result;
          }
        }
        return null;
      };

      const currentPath = useLocation().pathname;
      const selectedKey = useMemo(() => {
        return findKeyByPath(dataSysMenu, currentPath);
      }, [dataSysMenu, currentPath]);

      const [openKeys, setOpenKeys] = useState<string[]>([]);
      
      // 初始化时设置 openKeys
      useEffect(() => {
        if (selectedKey) {
          const parentKeys = findParentKeys(dataSysMenu, selectedKey) || [];
          setOpenKeys([...parentKeys, selectedKey]); // ✅ 父级 + 自己一起展开
        }
      }, [selectedKey, dataSysMenu]);

      // 切换主题时重置 openKeys（可选，避免展开异常）
      useEffect(() => {
        if (selectedKey) {
          const parentKeys = findParentKeys(dataSysMenu, selectedKey) || [];
          setOpenKeys([...parentKeys, selectedKey]);
        }
      }, [menuTheme, selectedKey, dataSysMenu]);
      
      // 使用 useMemo 缓存菜单项，避免每次渲染都重新构建
      const menuItems = useMemo(() => {
        return buildMenuItems(dataSysMenu);
      }, [dataSysMenu]);
      
      return (
        <>
        <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={
    {
      ...siderStyle,
      overflow: "hidden",
      backgroundColor: menuTheme === 'light' ? '#ffffff' : '#001529',
      '--antd-layout-sider-trigger-bg': menuTheme === 'light' ? '#f5f5f5' : '#002140',
      '--antd-layout-sider-trigger-color': menuTheme === 'light' ? '#000' : '#fff',
    } as React.CSSProperties
  }
      >
        <div className="demo-logo-vertical" />
         {/* 👇 新增：主题切换开关 */}
      <div  
      style={{
      padding: '12px 16px',
      borderBottom: menuTheme === 'dark' ? '1px solid #434343' : '1px solid #f0f0f0',
      backgroundColor: menuTheme === 'light' ? '#ffffff' : '#001529',
    }}
          >
        <Space>
           <Typography.Text style={{ color: menuTheme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>
            {menuTheme === 'dark' ? '深色' : '浅色'}
          </Typography.Text>
          <Switch
            checked={menuTheme === 'light'}
            onChange={(checked) => setMenuTheme(checked ? 'light' : 'dark')}
            size="small"
          />
        </Space>
      </div>

        <div
          style={{
            overflowY: "auto",
            height: "calc(100% - 56px)", // 减去开关区域高度
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          className="hide-scrollbar"
        >
          <Menu
             theme={menuTheme} //  关键：动态主题
            selectedKeys={selectedKey ? [selectedKey] : []}
            // defaultOpenKeys={[selectedKey || '']} 
            openKeys={openKeys} //  改为受控模式
            onOpenChange={(keys) => setOpenKeys(keys)}
            mode="inline"
            items={menuItems}
            onClick={({ key }) => handleOnClick(key)}
          />
        </div>
      </Sider>
      </>
      );
      
    
}

export default SysMenuIndex;