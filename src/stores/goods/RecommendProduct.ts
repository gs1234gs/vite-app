import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useCallback, useState } from 'react';

// 引入 API
import {
  searchProduct,
  recommend,
  like,
  detail,
  findAllProductsByIds
} from '@/api/goods/product/RecommendProduct';

// 引入类型
import type { RequestCursorPage } from '@/api/type/PageType';
import type { CursorPageResult } from '@/api/type/ResultType';
import type {
  ProductSearchSaveVO,
  ProductCustomerVO,
  ProductCustomerDetailVO
} from '@/api/goods/product/RecommendProductType';

function useRecommendProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 搜索商品（游标分页）
   */
  const searchProductApi = useCallback(
    async (params: RequestCursorPage<ProductSearchSaveVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchProduct(params);
        if (res.code === HttpStatusCode.Ok) {
          message.success(res.msg || '搜索成功');
          setLoading(false);
          return res.data as CursorPageResult<ProductCustomerVO>;
        }
      } catch (err) {
        setError(err as Error);
        message.error('搜索失败');
      }
      setLoading(false);
      return null;
    },
    []
  );

  /**
   * 推荐商品列表
   */
  const recommendApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await recommend();
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '推荐加载成功');
        setLoading(false);
        return res.data as ProductCustomerVO[];
      }
    } catch (err) {
      setError(err as Error);
      message.error('推荐加载失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 猜你喜欢
   */
  const likeApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await like();
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '“猜你喜欢”加载成功');
        setLoading(false);
        return res.data as ProductCustomerVO[];
      }
    } catch (err) {
      setError(err as Error);
      message.error('“猜你喜欢”加载失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 获取商品详情
   */
  const detailApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await detail(id);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '详情加载成功');
        setLoading(false);
        return res.data as ProductCustomerDetailVO;
      }
    } catch (err) {
      setError(err as Error);
      message.error('详情加载失败');
    }
    setLoading(false);
    return null;
  }, []);

   /**
   * 获取
   */
  const findAllProductRecommendByIdsApi = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findAllProductsByIds(ids);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '详情加载成功');
        setLoading(false);
        return res.data as ProductCustomerVO[];
      }
    } catch (err) {
      setError(err as Error);
      message.error('详情加载失败');
    }
    setLoading(false);
    return null;
  }, []);

  return {
    loading,
    error,
    searchProductApi,
    recommendApi,
    likeApi,
    detailApi,
    findAllProductRecommendByIdsApi
  };
}

export default useRecommendProduct;