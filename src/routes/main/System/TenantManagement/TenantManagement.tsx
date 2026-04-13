import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/tenant',
  element: <LazyLoad
    loader={() =>
      import("@/components/layout/content/main/system/TenantManagement/TenantManagement")
    }
  />
};
