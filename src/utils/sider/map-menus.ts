import type { RouteObject } from "react-router-dom"
import { cacheSession } from "../cache";

const loadLocalRouters = () => { 
    //动态路由
    const localRouters : RouteObject[] = []
    //读取ts文件
    const files : Record<string, any> = import.meta.glob(
        "@/routes/main/**/*.ts",
        {
            eager: true
        }
    )
     // 遍历文件模块，将默认导出的路由对象收集到 localRouters 数组中
  Object.keys(files).forEach((key) => {
    const module = files[key];
    if (module?.default) {
      localRouters.push(module.default);
    }
  });

  return localRouters;
}

// 记录第一个可用菜单项
export const firstMenu: { current: any | null } = { current: null };

/**
 * 将用户菜单递归映射为 React Router 动态路由表
 */
export const mapMenusToRouters = (userMenus: any[]): RouteObject[] => {
  const localRoutes: RouteObject[] = loadLocalRouters();
  const matchedRoutes: RouteObject[] = [];
  if (!Array.isArray(userMenus)) {
    console.error('userMenus 非数组：', userMenus);
    return [];
  }
  // console.log('localRoutes', userMenus);
  const recurseMatch = (menus: any[]) => {
    for (const menu of menus) {
      // 如果是子菜单（叶子节点），尝试匹配本地静态路由
      if (!menu.children || menu.children.length === 0) {
        const matched = localRoutes.find(route => `/${route.path}` === menu.path);
        //  const matched = localRoutes.find(route => route.path === menu.path);
        if (matched) {
          matchedRoutes.push(matched);

          if (!firstMenu.current) {
            firstMenu.current = menu;
            cacheSession.setCache('firstMenu', firstMenu.current)
          }
        }
      } else {
        // 有子菜单则继续递归
        recurseMatch(menu.children);
      }
    }
  };

  recurseMatch(userMenus);

  return matchedRoutes;
};

/**
 *跟据路径映射路由
 * @param path ,需要映射的路径
 * @param menus，需要映射的路由
 */
 export const mapMenusurls = (path : string,menus : any[]) => {
    for (const menu of menus) {
      for (const subMenu of menu.children) {
        if (subMenu.path === path) {
          return subMenu;
        }
      }
    }
};

interface IHamburger {
    name: string;
    path ?: string;
  }

  export const mapHamburger = (path : string ,userMenus: any[]) => {
    //定义面包屑
    const mapHamburgers : IHamburger []= []
    // 遍历用户菜单数据
    for (const menu of userMenus) {
      for (const subMenu of menu.children) {
        if (subMenu.path === path) {
          mapHamburgers.push({name:menu.name,path:menu.path})
          mapHamburgers.push({name:subMenu.name,path:subMenu.path})
        }
      }
    }
    return mapHamburgers
  
  };

  // 将菜单映射到权限列表
export const mapMenusToPermissions = (userMenus: any[]) => {
    const permissions: string[] = [];
  
    const _recurseGetPermission = (menus: any[]) => {
      for (const menu of menus) {
        if (menu.menuType === 'F') {
          permissions.push(menu.perms);
          // console.log('permissions', menu.perms);
        } else {
          _recurseGetPermission(menu.children ?? []);
       }
      }
    }
    _recurseGetPermission(userMenus);
    return permissions;
  }
  
  
  export default mapMenusToRouters;
  