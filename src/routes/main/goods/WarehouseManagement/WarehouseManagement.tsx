import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/warehouse',
  element: <LazyLoad
    loader={() => import('@/components/layout/content/main/goods/WarehouseManagement/WarehouseManagement')}
  />
};