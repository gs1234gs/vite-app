import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/category',
  element: <LazyLoad 
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/goods/CategoryManagement/CategoryManagement')}
  />
};