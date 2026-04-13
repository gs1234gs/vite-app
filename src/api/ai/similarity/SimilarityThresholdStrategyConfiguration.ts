import sendRequest from "../../axios";
import { AI_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type {
  SimilarityThresholdStrategyConfigurationVO,
  SimilarityThresholdStrategyConfigurationSaveVO,
  SimilarityThresholdStrategyConfigurationPageVO,
} from "./SimilarityThresholdStrategyConfigurationType";

/**
 * /similarity 接口前缀
 */
const SIMILARITY_PREFIX = `${AI_API_PREFIX}/similarity`;

/**
 * 保存相似度阈值策略配置
 */
export const saveSimilarityThresholdStrategyConfiguration = (
  data: SimilarityThresholdStrategyConfigurationSaveVO
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${SIMILARITY_PREFIX}/save`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 查询相似度阈值策略配置
 */
export const findSimilarityThresholdStrategyConfigurationById = (
  id: string
): Promise<ResultT<SimilarityThresholdStrategyConfigurationVO>> => {
  return sendRequest<ResultT<SimilarityThresholdStrategyConfigurationVO>>({
    url: `${SIMILARITY_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 分页查询相似度阈值策略配置
 */
export const findSimilarityThresholdStrategyConfigurationPage = (
  data: PageType<SimilarityThresholdStrategyConfigurationPageVO>
): Promise<ResultT<PageResult<SimilarityThresholdStrategyConfigurationVO[]>>> => {
  return sendRequest<ResultT<PageResult<SimilarityThresholdStrategyConfigurationVO[]>>>({
    url: `${SIMILARITY_PREFIX}/findPage`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 删除相似度阈值策略配置
 */
export const deleteSimilarityThresholdStrategyConfigurationById = (
  id: string
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${SIMILARITY_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 启用相似度阈值策略
 */
export const enableSimilarityThresholdStrategy = (
  id: string
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${SIMILARITY_PREFIX}/enableSimilarity/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
