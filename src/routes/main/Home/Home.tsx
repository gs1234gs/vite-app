import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'home',
  element: <LazyLoad
    loader={() => import('@/components/layout/content/main/Home/Home')}
  />
};
