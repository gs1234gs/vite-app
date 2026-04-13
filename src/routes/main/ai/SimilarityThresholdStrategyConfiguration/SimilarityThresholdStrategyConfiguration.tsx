import LazyLoad from "@/routes/LazyLoad";

export default {
  path: 'ai/similarity',
  element: <LazyLoad

    loader={() => import('@/components/layout/content/main/ai/SimilarityThresholdStrategyConfiguration/SimilarityThresholdStrategyConfiguration')}

  />
};