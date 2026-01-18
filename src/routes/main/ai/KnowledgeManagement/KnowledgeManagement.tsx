
import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'ai/knowledge',
  element: <LazyLoad 
  
  loader={()=>import('@/components/layout/MainIndexLayoutComponents/content/main/ai/KnowledgeManagement/KnowledgeManagement')}
  
  />
};