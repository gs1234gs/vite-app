import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/active',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/goods/ActiveManagement/ActiveManagement')}

  />
};