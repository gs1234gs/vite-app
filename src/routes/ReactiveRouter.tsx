import { SYSTEM_MENU_BAR_CONST_KEY } from "@/const/SiderBarConst";
import { cacheSession } from "@/utils/cache";
import mapMenusToRouters from "@/utils/sider/map-menus";

const reactiveRouter = () => {
 const menus = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY)
//  if(!menus){
//   return []
//  }
 const routes = mapMenusToRouters(menus)
//  console.log("14",routes)
  return routes;
};

export default reactiveRouter;
