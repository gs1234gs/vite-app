import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/carousel',
  element: <LazyLoad
  
  loader={() => import ('@/components/layout/MainIndexLayoutComponents/content/main/goods/CarouselManagement/CarouselManagement')}
  
  />
};