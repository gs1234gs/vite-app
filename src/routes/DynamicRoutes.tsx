import { Navigate, useLocation, useRoutes } from "react-router-dom";
import { cacheSession } from "@/utils/cache";
import { SIGN_IN_CONST_TOKEN } from "@/const/SignInConst";
import { SYSTEM_MENU_BAR_CONST_KEY } from "@/const/SiderBarConst";
import reactiveRouter from "@/routes/ReactiveRouter";
import { useEffect, useState } from "react";

// export default function DynamicRoutes() {
//   const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
//   const [routes, setRoutes] = useState<any[]>([]);

//   useEffect(() => {
//     const menus = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);
//     if (menus && menus.length > 0) {
//       setRoutes(reactiveRouter());
//     }
//   }, []);

//   if (!token) {
//     return <Navigate to="/sign-in" replace />;
//   }

//   if (routes.length === 0) {
//     return <div style={{ padding: 100, textAlign: "center" }}>路由加载中...</div>;
//   }

//   return useRoutes(routes);
// }

// import { useLocation } from "react-router-dom";
// import React from "react";

// export default function DynamicRoutes() {
//   const location = useLocation();

//   const routes = reactiveRouter();

//   return (
//     <React.Fragment key={location.pathname}>
//       {useRoutes(routes)}
//     </React.Fragment>
//   );
// }

export default function DynamicRoutes() {
  const location = useLocation();

  const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
  const menus = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);

  //  token 不在，直接回登录页
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  // 2 菜单不存在或为空
  if (!menus || menus.length === 0) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <h3>菜单数据丢失</h3>
        <p>请重新登录或联系管理员</p>
      </div>
    );
  }

  //  正常生成动态路由
  const routes = reactiveRouter();

  if (!routes || routes.length === 0) {
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        路由生成中，请稍候…
      </div>
    );
  }

  //  关键：随 pathname 变化强制重新挂载
  return (
    <div key={location.pathname}>
      {useRoutes(routes)}
    </div>
  );
}


