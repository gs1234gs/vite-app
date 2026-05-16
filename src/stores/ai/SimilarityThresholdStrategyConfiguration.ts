import { useState, useCallback } from "react";
import { message } from "antd";
import { HttpErrorHelper } from "@/utils/http/HttpErrorHelper";
import {
  saveSimilarityThresholdStrategyConfiguration,
  findSimilarityThresholdStrategyConfigurationById,
  findSimilarityThresholdStrategyConfigurationPage,
  deleteSimilarityThresholdStrategyConfigurationById,
  enableSimilarityThresholdStrategy,
} from "@/api/ai/similarity/SimilarityThresholdStrategyConfiguration";
import type { PageType } from "@/api/type/PageType";
import type {
  SimilarityThresholdStrategyConfigurationVO,
  SimilarityThresholdStrategyConfigurationSaveVO,
  SimilarityThresholdStrategyConfigurationPageVO,
} from "@/api/ai/similarity/SimilarityThresholdStrategyConfigurationType";

/**
 * 相似度阈值策略配置管理 Hook
 */
export function useSimilarityThresholdStrategyConfiguration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [detailData, setDetailData] = useState<SimilarityThresholdStrategyConfigurationVO | null>(null);

  /**
   * 保存相似度阈值策略配置
   */
  const saveApi = useCallback(async (data: SimilarityThresholdStrategyConfigurationSaveVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await saveSimilarityThresholdStrategyConfiguration(data);
      if (res.code === 200) {
        // message.success("保存成功");
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        // message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 根据 ID 查询详情
   */
  const findByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findSimilarityThresholdStrategyConfigurationById(id);
      if (res.code === 200) {
        setDetailData(res.data);
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        // message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 分页查询
   */
  const findPageApi = useCallback(async (data: PageType<SimilarityThresholdStrategyConfigurationPageVO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findSimilarityThresholdStrategyConfigurationPage(data);
      if (res.code === 200) {
        setPageData(res.data);
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        // message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 根据 ID 删除
   */
  const deleteByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteSimilarityThresholdStrategyConfigurationById(id);
      if (res.code === 200) {
        // message.success("删除成功");
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        // message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 启用相似度阈值策略
   */
  const enableSimilarityApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await enableSimilarityThresholdStrategy(id);
      if (res.code === 200) {
        // message.success("启用成功");
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        // message.warning(msg);
        throw new Error(msg);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    pageData,
    detailData,
    saveApi,
    findByIdApi,
    findPageApi,
    deleteByIdApi,
    enableSimilarityApi,
  };
}
