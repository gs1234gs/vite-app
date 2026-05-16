import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { ResultT, PageResult } from '@/api/type/ResultType';
import {
  findPage,
  save,
  updateById,
  findById,
  findByUserId,
  findByUserIdPage,
  findByUserIds,
  findByRows,
  deletedById
} from '@/api/order/order/PurChaseOrder'; // 请根据实际路径调整
import type {
  PurchaseOrderDetailVO,
  PurChaseOrderSaveVO,
  PurchaseOrderSearchVO,
  PurChaseOrderVO,
} from '@/api/order/order/OrderType'; // 请根据实际路径调整

function usePurChaseOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    const errorMsg = err?.message || defaultMsg;
    message.error(errorMsg);
    setError(new Error(errorMsg));
  }, []);

  /**
   * 后台分页查询所有订单
   */
  const findPageApi = useCallback(
    async (data: PageType<PurChaseOrderVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PageResult<PurChaseOrderVO>> = await findPage(data);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '加载订单列表失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 根据订单 ID 查询订单详情
   */
  const findByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PurchaseOrderDetailVO> = await findById(id);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '获取订单详情失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );
  /**
   * 根据订单 ID 查询订单详情
   */
  const deletedByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
         await deletedById(id);
      
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 添加订单
   */
  const saveApi = useCallback(
    async (data: PurChaseOrderSaveVO) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<string> = await save(data);
        if (res.code === 200) {
          message.success(res.msg || '订单创建成功');
          return res.data; // 返回新订单 ID
        } else {
          handleError(null, res.msg || '创建订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 修改订单（更新）
   */
  const updateByIdApi = useCallback(
    async (data: PurChaseOrderSaveVO) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<string> = await updateById(data);
        if (res.code === 200) {
          message.success(res.msg || '订单更新成功');
          return res.data;
        } else {
          handleError(null, res.msg || '更新订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 根据用户 ID 查询该用户最近 N 条订单（不分页）
   */
  const findByUserIdApi = useCallback(
    async (userId: string, rows: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PurChaseOrderVO[]> = await findByUserId(userId, rows);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '查询用户订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 分页查询某用户的订单
   */
  const findByUserIdPageApi = useCallback(
    async (data: PageType<PurchaseOrderSearchVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PageResult<PurChaseOrderVO>> = await findByUserIdPage(data);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '分页查询用户订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 批量根据多个用户 ID 查询订单
   */
  const findByUserIdsApi = useCallback(
    async (userIds: string[], rows: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PurChaseOrderVO[]> = await findByUserIds(userIds, rows);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '批量查询订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 查询最近 N 条全局订单
   */
  const findByRowsApi = useCallback(
    async (rows: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PurChaseOrderVO[]> = await findByRows(rows);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '查询最新订单失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  return {
    loading,
    error,
    findPageApi,
    findByIdApi,
    saveApi,
    updateByIdApi,
    findByUserIdApi,
    findByUserIdPageApi,
    findByUserIdsApi,
    findByRowsApi,
    deletedByIdApi
  };
}

export default usePurChaseOrder;