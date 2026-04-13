import LazyLoad from "../../../LazyLoad";

export default {
  path: 'ai/model',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/ai/ModelManagement/ModelManagement')}

  />
};