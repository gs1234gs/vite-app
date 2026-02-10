import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { cacheSession } from "@/utils/cache";
import { SIGN_IN_CONST_TOKEN } from "@/const/SignInConst";
import { SYSTEM_MENU_BAR_CONST_KEY } from "@/const/SiderBarConst";
import reactiveRouter from "@/routes/ReactiveRouter";
import { useEffect, useState, useMemo } from "react";

export default function DynamicRoutes() {
  const location = useLocation();

  const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
  const menus = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);

  // token 不在，直接回登录页
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // 菜单不存在或为空
  if (!menus || menus.length === 0) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <h3>菜单数据丢失</h3>
        <p>请重新登录或联系管理员</p>
      </div>
    );
  }

  // 使用 useMemo 缓存路由，仅当菜单变化时才重新计算
  const routes = useMemo(() => {
    return reactiveRouter();
  }, [menus]); // 添加 menus 作为依赖

  if (!routes || routes.length === 0) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        路由生成中，请稍候…
      </div>
    );
  }

  // 使用 location.key 作为 key，确保在导航时组件能正确更新
  return (
    <div key={location.key}>
      {useRoutes(routes)}
    </div>
  );
}


