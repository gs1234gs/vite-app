import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "@/routes/LazyLoad";
// import reactiveRouter from "./ReactiveRouter";
import MainLayoutWrapper from "@/routes/MainLayoutWrapper";
import DynamicRoutes from "@/routes/DynamicRoutes";
import React from "react";
// import SystemIntro from "../components/SystemIntro/SystemIntro.tsx";
const System = React.lazy(() => import("@/components/SystemIntro/SystemIntro"));
const SearchResultsPage = React.lazy(() => import("@/components/layout/content/main/Home/SearchPage/SearchResultsPage"));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayoutWrapper />,
    }, {
      path: "/sign-in",
      element: <LazyLoad loader={() => import("@/components/templates/sign-in-side/App")} />,

    }, {
      path: "/sign-up",
      element: <LazyLoad loader={() => import("@/components/templates/sign-up/SignUp")} />,
    },
    {
      path: "/main/*",
      element: <MainLayoutWrapper />,
      children: [{
        // index: true,
        path: "*",
        element: <DynamicRoutes />,
      }],
    },
    {
      path: "*",
      element: <LazyLoad loader={() => import("@/views/NotFound")} />
    },
    {
      path: '/system',
      element: <System />
    }
    ,
    {
      path: "/search",
      element: <SearchResultsPage />
    }

  ]
)

export default router
