import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/tag',
  element: <LazyLoad
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/goods/TagManagement/TagManagement')}
  />
};