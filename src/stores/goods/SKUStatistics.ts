import {
  getOverview,
  getLowStockAlerts,
  getTopSellingRanking,
  getSlowMovingRanking,
} from '@/api/goods/sku/SKUStatistics';
import type { SkuStatisticsVO, SKURankingVO } from '@/api/goods/sku/SKUStatisticsType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

// SKU统计报表 Hook
function useSkuStatistics() {
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
        if (showSuccessMsg) {
          message.success(res.msg);
        }
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

  // 获取统计概览
  const getOverviewApi = useCallback(async (timeRange: string = "all"): Promise<SkuStatisticsVO | null> => {
    return withLoading(() => getOverview(timeRange), false);
  }, []);

  // 获取库存预警
  const getLowStockAlertsApi = useCallback(
    async (threshold: number = 10, limit: number = 20): Promise<SKURankingVO[] | null> => {
      return withLoading(() => getLowStockAlerts(threshold, limit), false);
    },
    []
  );

  // 获取热销排行
  const getTopSellingRankingApi = useCallback(
    async (limit: number = 10): Promise<SKURankingVO[] | null> => {
      return withLoading(() => getTopSellingRanking(limit), false);
    },
    []
  );

  // 获取滞销排行
  const getSlowMovingRankingApi = useCallback(
    async (days: number = 30, limit: number = 10): Promise<SKURankingVO[] | null> => {
      return withLoading(() => getSlowMovingRanking(days, limit), false);
    },
    []
  );

  return {
    loading,
    error,
    getOverviewApi,
    getLowStockAlertsApi,
    getTopSellingRankingApi,
    getSlowMovingRankingApi,
  };
}

export default useSkuStatistics;
