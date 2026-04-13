
import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'ai/knowledge',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/ai/KnowledgeManagement/KnowledgeManagement')}

  />
};