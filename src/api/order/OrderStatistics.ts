import sendRequest from "../axios";
import { ORDER_API_PREFIX } from "../prefix/PrefixApi";
import { GET_METHOD } from "../type/ConstRequestMethods";
import type { ResultT } from "../type/ResultType";
import type { 
  OrderStatisticsVO,
  OrderStatistics7DaysVO,
  OrderStatistics30DaysVO,
  OrderStatistics12MonthsVO,
  HourlyHeatmapVO
} from "./OrderStatisticsType";

const ORDER_STATISTICS_PREFIX = `${ORDER_API_PREFIX}/purchaseStatistics`;

// 获取订单统计概览（包含趋势数据）
export const getOrderOverview = (
  timeRange: string = "7d",
  startTime?: string,
  endTime?: string
): Promise<ResultT<OrderStatisticsVO>> => {
  return sendRequest<ResultT<OrderStatisticsVO>>({
    url: `${ORDER_STATISTICS_PREFIX}/overview`,
    method: GET_METHOD,
    params: { timeRange, startTime, endTime },
  }).then((res) => res.data);
};

// 获取近7天订单统计（水波图专用）
export const getOrderStatistics7Days = (): Promise<ResultT<OrderStatistics7DaysVO>> => {
  return sendRequest<ResultT<OrderStatistics7DaysVO>>({
    url: `${ORDER_STATISTICS_PREFIX}/7days`,
    method: GET_METHOD,
  }).then((res) => res.data);
};

// 获取近30天订单统计（水波图专用）
export const getOrderStatistics30Days = (): Promise<ResultT<OrderStatistics30DaysVO>> => {
  return sendRequest<ResultT<OrderStatistics30DaysVO>>({
    url: `${ORDER_STATISTICS_PREFIX}/30days`,
    method: GET_METHOD,
  }).then((res) => res.data);
};

// 获取近12个月订单统计（水波图专用）
export const getOrderStatistics12Months = (): Promise<ResultT<OrderStatistics12MonthsVO>> => {
  return sendRequest<ResultT<OrderStatistics12MonthsVO>>({
    url: `${ORDER_STATISTICS_PREFIX}/12months`,
    method: GET_METHOD,
  }).then((res) => res.data);
};

// 获取下单趋势热力图数据
export const getOrderTrend = (
  rangeType: string = "7d"
): Promise<ResultT<HourlyHeatmapVO>> => {
  return sendRequest<ResultT<HourlyHeatmapVO>>({
    url: `${ORDER_STATISTICS_PREFIX}/orderTrend`,
    method: GET_METHOD,
    params: { rangeType },
  }).then((res) => res.data);
};
