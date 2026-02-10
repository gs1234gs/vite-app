import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/warehouse',
  element: <LazyLoad
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/goods/WarehouseManagement/WarehouseManagement')}
  />
};