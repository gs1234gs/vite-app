import LazyLoad from "../../../LazyLoad";

export default {
  path: 'ai/model',
  element: <LazyLoad
  
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/ai/ModelManagement/ModelManagement')}
  
  />
};