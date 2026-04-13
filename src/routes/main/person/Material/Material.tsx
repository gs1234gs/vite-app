import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'person/material',
  element: <LazyLoad
    loader={() =>
      import("@/components/layout/content/main/person/Material/Material")
    }
  />
};
