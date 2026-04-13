import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'goods/sku',
  element: <LazyLoad
    loader={() => import(
      '@/components/layout/content/main/goods/SkuManagement/SkuManagement'
    )}
  />
};