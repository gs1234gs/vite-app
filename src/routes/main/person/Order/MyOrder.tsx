import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'person/order',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/person/Order/MyOrdersPage')}

  />
};