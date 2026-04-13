import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/role',
  element: <LazyLoad loader={() =>
    import("@/components/layout/content/main/system/RoleManagement/RoleManagement")
  }
  />
};