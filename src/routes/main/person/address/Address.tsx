

import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'person/address',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/person/address/Address')}

  />
};