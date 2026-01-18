import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/inventory',
  element: <LazyLoad 
  
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/goods/InventoryManagement/InventoryManagement')}
  
  />
};