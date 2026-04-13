import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/dept',
  element: <LazyLoad
    loader={() => import('@/components/layout/content/main/system/DeptManagement/DeptManagement')}
  />
};