import {  createHashRouter } from "react-router-dom";
import  LazyLoad  from "@/routes/LazyLoad";
// import reactiveRouter from "./ReactiveRouter";
import MainLayoutWrapper from "@/routes/MainLayoutWrapper";
import DynamicRoutes from "@/routes/DynamicRoutes";
import React from "react";
// import SystemIntro from "../components/SystemIntro/SystemIntro.tsx";
const System = React.lazy(() => import("@/components/SystemIntro/SystemIntro"));

const router = createHashRouter(
  [
    {
      path: "/",
      element: <MainLayoutWrapper />,
    },
    {
      path: "/home",
    
      element:<LazyLoad loader={() => import("@/views/home/HomeIndex")} />,
      children: []

    },{
      path:"/sign-in",
      element:<LazyLoad loader={()=> import("@/components/templates/sign-in-side/App")}/>,

    },{
      path:"/sign-up",
      element:<LazyLoad loader={() => import("@/components/templates/sign-up/SignUp")} />,
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
      element: <LazyLoad loader={() => import("@/views/NotFound/NotFound")}/>
    },
    {
      path:'/system',
      element:<System />
    }

  ]
)

export default router
