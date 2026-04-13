import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'person/collect',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/person/Collect/MyCollect')}

  />
};