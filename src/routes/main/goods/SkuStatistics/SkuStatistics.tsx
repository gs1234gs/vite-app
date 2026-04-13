import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/sku-statistics',
  element: <LazyLoad
    loader={() => import(
      '@/components/layout/content/main/goods/SkuStatistics/SkuStatistics'
    )}
  />
};
