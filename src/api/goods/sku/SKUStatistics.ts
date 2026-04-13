import sendRequest from "../../axios";
import { GOODS_API_PREFIX } from "../../prefix/PrefixApi";
import { GET_METHOD } from "../../type/ConstRequestMethods";
import type { ResultT } from "../../type/ResultType";
import type { SkuStatisticsVO, SKURankingVO } from "./SKUStatisticsType";

const SKU_STATISTICS_PREFIX = `${GOODS_API_PREFIX}/sku/statistics`;

// 获取统计概览（包含趋势数据）
export const getOverview = (timeRange: string = "all"): Promise<ResultT<SkuStatisticsVO>> => {
  return sendRequest<ResultT<SkuStatisticsVO>>({
    url: `${SKU_STATISTICS_PREFIX}/overview`,
    method: GET_METHOD,
    params: { timeRange },
  }).then((res) => res.data);
};

// 获取库存预警（低库存）
export const getLowStockAlerts = (
  threshold: number = 10,
  limit: number = 20
): Promise<ResultT<SKURankingVO[]>> => {
  return sendRequest<ResultT<SKURankingVO[]>>({
    url: `${SKU_STATISTICS_PREFIX}/alerts/low-stock`,
    method: GET_METHOD,
    params: { threshold, limit },
  }).then((res) => res.data);
};

// 获取热销排行
export const getTopSellingRanking = (
  limit: number = 10
): Promise<ResultT<SKURankingVO[]>> => {
  return sendRequest<ResultT<SKURankingVO[]>>({
    url: `${SKU_STATISTICS_PREFIX}/rankings/top-selling`,
    method: GET_METHOD,
    params: { limit },
  }).then((res) => res.data);
};

// 获取滞销排行
export const getSlowMovingRanking = (
  days: number = 30,
  limit: number = 10
): Promise<ResultT<SKURankingVO[]>> => {
  return sendRequest<ResultT<SKURankingVO[]>>({
    url: `${SKU_STATISTICS_PREFIX}/rankings/slow-moving`,
    method: GET_METHOD,
    params: { days, limit },
  }).then((res) => res.data);
};
