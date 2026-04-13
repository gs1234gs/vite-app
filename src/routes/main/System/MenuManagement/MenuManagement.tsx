import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/menu',
  element: <LazyLoad loader={() => import('@/components/layout/content/main/system/MenuManagement/MenuManagement')} />
};