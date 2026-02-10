import { SYSTEM_MENU_BAR_CONST_KEY } from "@/const/SiderBarConst";
import { cacheSession } from "@/utils/cache";
import mapMenusToRouters from "@/utils/sider/map-menus";

const reactiveRouter = () => {
  const menus = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);
  if (!menus || menus.length === 0) {
    return [];
  }
  const routes = mapMenusToRouters(menus);
  return routes;
};

export default reactiveRouter;