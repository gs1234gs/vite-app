import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "@/routes/LazyLoad";
// import reactiveRouter from "./ReactiveRouter";
import MainLayoutWrapper from "@/routes/MainLayoutWrapper";
import DynamicRoutes from "@/routes/DynamicRoutes";
// import SystemIntro from "../components/SystemIntro/SystemIntro.tsx";

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
      path: "/forgot-password",
      element: <LazyLoad loader={() => import("@/components/templates/forgot-password/ForgotPassword")} />,
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
      element: <LazyLoad loader={() => import("@/components/SystemIntro/SystemIntro")} />
    }
    ,
    {
      path: "/search",
      element: <LazyLoad loader={() => import("@/components/layout/content/main/Home/SearchPage/SearchResultsPage")} />
    }

  ]
)

export default router