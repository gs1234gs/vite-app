import {  createHashRouter } from "react-router-dom";
import  LazyLoad  from "./LazyLoad";
// import reactiveRouter from "./ReactiveRouter";
import MainLayoutWrapper from "./MainLayoutWrapper";
import DynamicRoutes from "./DynamicRoutes";
import React from "react";
import SystemIntro from "../components/SystemIntro/SystemIntro.tsx";
const System = React.lazy(() => import("../components/SystemIntro/SystemIntro.tsx"));

const router = createHashRouter(
  [
    {
      path: "/",
      element: <MainLayoutWrapper />,
    },
    {
      path: "/home",
    
      element:LazyLoad("../views/home/HomeIndex"),
      children: []

    },{
      path:"/sign-in",
      element:LazyLoad("../components/templates/sign-in-side/App"),

    },{
      path:"/sign-up",
      element:LazyLoad("../components/templates/sign-up/SignUp"),
    },
    {
      path:"/main/*",
      element: <MainLayoutWrapper />, 
      children:[{
        // index: true,
        path:"*",
        element: <DynamicRoutes />, 
      }],
    },
    {
      path: "*",
      element: LazyLoad("../views/NotFound/NotFound.tsx")
    },{
      path:'/system',
      element:<System />
    }

  ]
)

export default router
