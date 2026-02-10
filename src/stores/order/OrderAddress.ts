import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { ResultT, PageResult } from '@/api/type/ResultType';
import {
  findPage,
  save,
  findById,
  deleteById,
  findByOrderId,
  findByUserId,
  findByOrderIds,
} from '@/api/order/address/OrderAddress'; // 请根据实际路径调整
import type {
  OrderAddressSaveVO,
  OrderAddressVO,
} from '@/api/order/address/OrderAddressType'; // 请根据实际路径调整

function useOrderAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    const errorMsg = err?.message || defaultMsg;
    message.error(errorMsg);
    setError(new Error(errorMsg));
  }, []);

  /**
   * 分页查询地址列表
   */
  const findPageApi = useCallback(
    async (data: PageType<OrderAddressVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PageResult<OrderAddressVO>> = await findPage(data);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '加载地址列表失败');
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
   * 根据 ID 查询单个地址
   */
  const findByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO> = await findById(id);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '获取地址详情失败');
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
   * 删除地址
   */
  const deleteByIdApi = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<void> = await deleteById(id);
        if (res.code === 200) {
          message.success(res.msg || '删除成功');
          return res.data;
        } else {
          handleError(null, res.msg || '删除地址失败');
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
   * 保存（新增或更新）地址
   */
  const saveApi = useCallback(
    async (data: OrderAddressSaveVO) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<string> = await save(data); // 后端返回 BigInteger ID，前端为 string
        if (res.code === 200) {
          message.success(res.msg || '保存成功');
          return res.data; // 返回新地址 ID
        } else {
          handleError(null, res.msg || '保存地址失败');
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
   * 根据订单 ID 查询地址
   */
  const findByOrderIdApi = useCallback(
    async (orderId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO> = await findByOrderId(orderId);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '查询订单地址失败');
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
   * 根据用户 ID 查询所有地址
   */
  const findByUserIdApi = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO[]> = await findByUserId(userId);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '查询用户地址失败');
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
   * 批量根据订单 IDs 查询地址
   */
  const findByOrderIdsApi = useCallback(
    async (orderIds: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO[]> = await findByOrderIds(orderIds);
        if (res.code === 200) {
          return res.data;
        } else {
          handleError(null, res.msg || '批量查询地址失败');
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
    deleteByIdApi,
    saveApi,
    findByOrderIdApi,
    findByUserIdApi,
    findByOrderIdsApi,
  };
}

export default useOrderAddress;