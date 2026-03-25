import { Navigate ,useLocation} from "react-router-dom";
import { cacheSession } from "@/utils/cache";
import { SIGN_IN_CONST_TOKEN } from "@/const/SignInConst";
import { SYSTEM_MENU_BAR_CONST_KEY } from "@/const/SiderBarConst";
import LazyLoad from "@/routes/LazyLoad";

const MainIndexLayout = <LazyLoad 
    loader={()=>import("@/components/layout/MainIndexLayout.tsx")}
/>;

const MainLayoutWrapper = () => {
  const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
  const siderBars = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // 检查侧边栏是否存在且不为空
  if (!siderBars || siderBars.length === 0) {
    // 菜单没准备好时，显示 loading 或占位符
    return <div style={{ textAlign: 'center', padding: 100 }}>菜单加载中，请稍候...</div>;
  }

  return MainIndexLayout;
};

export default MainLayoutWrapper;