import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'system/user',
  element: <LazyLoad
    loader={() =>
      import("@/components/layout/content/main/system/UserManagement/UserManagement")
    }
  />
};