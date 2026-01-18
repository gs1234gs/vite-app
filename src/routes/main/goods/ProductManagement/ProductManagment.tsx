import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/list',
  element: <LazyLoad
  
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/goods/ProductManagement/ProductManagement')}
  
  />
};