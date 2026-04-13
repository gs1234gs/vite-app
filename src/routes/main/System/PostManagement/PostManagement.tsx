import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/post',
  element: <LazyLoad loader={() => import('@/components/layout/content/main/system/PostManagement/PostManagement')} />
};