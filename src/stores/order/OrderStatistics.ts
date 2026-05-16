import { 
  getOrderOverview,
  getOrderStatistics7Days,
  getOrderStatistics30Days,
  getOrderStatistics12Months,
  getOrderTrend
} from '@/api/order/OrderStatistics';
import type { 
  OrderStatisticsVO,
  OrderStatistics7DaysVO,
  OrderStatistics30DaysVO,
  OrderStatistics12MonthsVO,
  HourlyHeatmapVO
} from '@/api/order/OrderStatisticsType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

// 订单统计报表 Hook
function useOrderStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 通用请求封装
  const withLoading = async <T>(
    apiCall: () => Promise<any>,
    showSuccessMsg = false
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall();
      if (res.code === HttpStatusCode.Ok) {
      
        return res.data;
      } else {
        message.error(res.msg || '操作失败');
        setError(res.msg || '请求失败');
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '网络异常，请稍后重试';
      message.error(errorMsg);
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 获取订单统计概览（包含趋势数据）
  const getOrderOverviewApi = useCallback(
    async (
      timeRange: string = "7d",
      startTime?: string,
      endTime?: string
    ): Promise<OrderStatisticsVO | null> => {
      return withLoading(() => getOrderOverview(timeRange, startTime, endTime), false);
    },
    []
  );

  // 获取近7天订单统计（水波图专用）
  const getOrderStatistics7DaysApi = useCallback(
    async (): Promise<OrderStatistics7DaysVO | null> => {
      return withLoading(() => getOrderStatistics7Days(), false);
    },
    []
  );

  // 获取近30天订单统计（水波图专用）
  const getOrderStatistics30DaysApi = useCallback(
    async (): Promise<OrderStatistics30DaysVO | null> => {
      return withLoading(() => getOrderStatistics30Days(), false);
    },
    []
  );

  // 获取近12个月订单统计（水波图专用）
  const getOrderStatistics12MonthsApi = useCallback(
    async (): Promise<OrderStatistics12MonthsVO | null> => {
      return withLoading(() => getOrderStatistics12Months(), false);
    },
    []
  );

  // 获取下单趋势热力图数据
  const getOrderTrendApi = useCallback(
    async (rangeType: string = "7d"): Promise<HourlyHeatmapVO | null> => {
      return withLoading(() => getOrderTrend(rangeType), false);
    },
    []
  );

  return {
    loading,
    error,
    getOrderOverviewApi,
    getOrderStatistics7DaysApi,
    getOrderStatistics30DaysApi,
    getOrderStatistics12MonthsApi,
    getOrderTrendApi,
  };
}

export default useOrderStatistics;
