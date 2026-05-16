// src/hooks/useProductCarousal.ts

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import type { ProductCarousalSaveVO } from '@/api/goods/carousel/ProductCarouselType';
import { deleteProductCarousalBatch,
     deleteProductCarousalById, 
     findAllProductCarousals,
      saveProductCarousal ,
    findByid,
    findByType

} from '@/api/goods/carousel/ProductCarousel';

/**
 * 轮播图业务 Hook（CRUD 封装）
 */
function useProductCarousal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 保存轮播图（新增/更新）
  const saveProductCarousalApi = useCallback(
    async (saveData: ProductCarousalSaveVO) => {
      setLoading(true);
      try {
        const res = await saveProductCarousal(saveData);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg || '轮播图保存成功');
          return res.data; // ProductCarousalVO
        } else {
          message.error(res.msg || '轮播图保存失败');
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('请求异常，请检查网络');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 查询全部轮播图（不分页）
  const findAllProductCarousalsApi = useCallback(async () => {
    setLoading(true);
    try {
      const res = await findAllProductCarousals();
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '查询成功');
        return res.data; // ProductCarousalVO[]
      } else {
        message.error(res.msg || '查询失败');
        return null;
      }
    } catch (err) {
      setError(err as Error);
      message.error('请求异常，请检查网络');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  //  根据 ID 删除单个轮播图
  const deleteProductCarousalByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await deleteProductCarousalById(id);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg || '删除成功');
          return res.data; // void
        } else {
          message.error(res.msg || '删除失败');
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('请求异常，请检查网络');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  //  根据 ID 获取单个轮播图单个轮播图
  const findProductCarousalByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const res = await findByid(id);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg)
          return res.data; 
        } else {
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('请求异常，请检查网络');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  //  根据 类型 获取单个轮播图
  const findProductCarousalByTypeApi = useCallback(
    async (type: number) => {
      setLoading(true);
      try {
        const res = await findByType(type);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg)
          return res.data; 
        } else {
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('请求异常，请检查网络');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  //批量删除轮播图
  const deleteProductCarousalBatchApi = useCallback(
    async (ids: string[]) => {
      setLoading(true);
      try {
        const res = await deleteProductCarousalBatch(ids);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg || '批量删除成功');
          return res.data; // void
        } else {
          message.error(res.msg || '批量删除失败');
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('请求异常，请检查网络');
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    saveProductCarousalApi,
    findAllProductCarousalsApi,
    deleteProductCarousalByIdApi,
    deleteProductCarousalBatchApi,
    findProductCarousalByIdApi,
    findByType
  };
}

export default useProductCarousal;