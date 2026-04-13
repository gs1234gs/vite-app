import type { BasePojo } from "../../type/BasePojo";

/**
 * 相似度阈值策略配置 VO（继承 BasePojo）
 */
export interface SimilarityThresholdStrategyConfigurationVO extends BasePojo {
  /** 主键 ID */
  id: string;
  
  /** 相似度阈值 */
  similarityThreshold: number;
}

/**
 * 相似度阈值策略配置保存 VO
 */
export interface SimilarityThresholdStrategyConfigurationSaveVO {
  /** 主键 ID（新增时可为空） */
  id?: string;
  
  /** 相似度阈值 */
  similarityThreshold: number;
}

/**
 * 相似度阈值策略配置分页查询条件 VO
 */
export interface SimilarityThresholdStrategyConfigurationPageVO {
  /** 名称（模糊查询） */
  name?: string;
}
