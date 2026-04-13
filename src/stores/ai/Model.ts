import { useState, useCallback } from "react";
import { message } from "antd";
import { HttpErrorHelper } from "@/utils/http/HttpErrorHelper";
import {
  saveBigModel,
  deleteBigModelById,
  findBigModelPage,
  findBigModelById,
} from "@/api/ai/model/Model";
import type { PageType } from "@/api/type/PageType";
import type { BigModelVO, BigModelSaveVO, BigModelPageVO } from "@/api/ai/model/ModelType";

/**
 * 大模型管理 Hook
 */
export function useBigModel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pageData, setPageData] = useState<any>(null);
  const [detailData, setDetailData] = useState<BigModelVO | null>(null);

  /**
   * 保存大模型（新增或编辑）
   */
  const saveApi = useCallback(async (data: BigModelSaveVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await saveBigModel(data);
      if (res.code === 200) {
        message.success("保存成功");
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
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
   * 根据 ID 删除大模型
   */
  const deleteByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteBigModelById(id);
      if (res.code === 200) {
        message.success("删除成功");
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
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
   * 分页查询大模型
   */
  const findPageApi = useCallback(async (data: PageType<BigModelPageVO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findBigModelPage(data);
      if (res.code === 200) {
        setPageData(res.data);
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
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
   * 根据 ID 查询大模型详情
   */
  const findByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findBigModelById(id);
      if (res.code === 200) {
        setDetailData(res.data);
        return res.data;
      } else {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.msg);
        message.warning(msg);
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
    deleteByIdApi,
    findPageApi,
    findByIdApi,
  };
}
