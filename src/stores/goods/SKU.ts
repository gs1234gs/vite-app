import { deleteBySkuId, findBySkuId, findSkuPage, saveSku,findByProductId } from '@/api/goods/sku/SKU';
import type { SKUGroupByProductIdVO, SKUSaveVO, SKUVO } from '@/api/goods/sku/SKUType';
import type { PageType } from '@/api/type/PageType';
import type { PageResult, ResultT } from '@/api/type/ResultType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

// Hook
function useSku() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🛠️ 提取通用请求封装（可选：也可内联）
  const withLoading = async <T>(
    apiCall: () => Promise<ResultT<T>>,
    showSuccessMsg = false // 控制是否显示 success 消息
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

  const saveSkuApi = useCallback(async (save: SKUSaveVO): Promise<string | null> => {
    return withLoading(() => saveSku(save), true); // 保存操作显示成功提示
  }, []);

  const findByIdApi = useCallback(async (id: string): Promise<SKUVO | null> => {
    return withLoading(() => findBySkuId(id), false); // 查询一般不弹 success
  }, []);

  const deleteByIdApi = useCallback(async (id: string): Promise<string | null> => {
    return withLoading(() => deleteBySkuId(id), true);
  }, []);

  const findSkuPageApi = useCallback(
    async (page: PageType<SKUVO>): Promise<PageResult<SKUGroupByProductIdVO> | null> => {
      return withLoading(() => findSkuPage(page), false);
    },
    []
  );

    const findSkuByProductIdApi = useCallback(
    async (productId: string): Promise<SKUVO > => {
      return withLoading(() => findByProductId(productId), false);
    },
    []
  );

  return {
    loading,
    error,
    saveSkuApi,
    findByIdApi,
    deleteByIdApi,
    findSkuPageApi,
    findSkuByProductIdApi
  };
}

export default useSku;
