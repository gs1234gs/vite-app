import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'home',
  element: <LazyLoad
  loader={() => import ('@/components/layout/MainIndexLayoutComponents/content/main/Home/Home')}
  />
};
