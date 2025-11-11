import { Navigate, useRoutes } from "react-router-dom";
import { cacheSession } from "../utils/cache";
import { SIGN_IN_CONST_TOKEN } from "../const/SignInConst";
import { SYSTEM_MENU_BAR_CONST_KEY } from "../const/SiderBarConst";
import reactiveRouter from "./ReactiveRouter";

export default function DynamicRoutes() {
// console.log('DynamicRoutes')
const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
const siderBars = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);
if(!token || !siderBars){
    return <Navigate to="/sign-in" replace />;
}

const routes = reactiveRouter();


  const elements = useRoutes(routes);
  return elements;
}