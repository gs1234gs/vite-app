import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/discount',
  element: <LazyLoad
    loader={() => import('@/components/layout/content/main/goods/DiscountManagement/DiscountManagement')}
  />
};