import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/dept',
  element: <LazyLoad 
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/system/DeptManagement/DeptManagement')}
  />
};