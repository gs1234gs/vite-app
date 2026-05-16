import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { ResultT, PageResult } from '@/api/type/ResultType';
import {
  findPageApi,
  saveApi,
  findByIdApi,
  deleteByIdApi,
  findByOrderIdApi,
  findByUserIdApi,
  findByOrderIdsApi,
} from '@/api/order/address/OrderAddress';
import type {
  OrderAddressSaveVO,
  OrderAddressVO,
} from '@/api/order/address/OrderAddressType';

const useOrderAddress = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [addressList, setAddressList] = useState<PageResult<OrderAddressVO[]> | null>(null);

  const handleError = useCallback((err: any, defaultMsg: string) => {
    const errorMsg = err?.message || defaultMsg;
    message.error(errorMsg);
    setError(new Error(errorMsg));
  }, []);

  /**
   * 分页查询地址列表
   */
  const findPage = useCallback(
    async (data: PageType<OrderAddressVO>) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<PageResult<OrderAddressVO[]>> = await findPageApi(data);
        if (res.code === 200) {
          setAddressList(res.data || null);
          setError(null);
          return res.data;
        } else {
          handleError(null, res.msg || '加载地址列表失败');
          setAddressList(null);
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        setAddressList(null);
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
  const findById = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO> = await findByIdApi(id);
        if (res.code === 200) {
          setError(null);
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
  const deleteById = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<void> = await deleteByIdApi(id);
        if (res.code === 200) {
          message.success('删除成功');
          setError(null);
          return true;
        } else {
          handleError(null, res.msg || '删除地址失败');
          return false;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  /**
   * 保存（新增或更新）地址
   */
  const save = useCallback(
    async (data: OrderAddressSaveVO) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<number> = await saveApi(data);
        if (res.code === 200) {
          message.success(data.id ? '更新地址成功' : '新增地址成功');
          setError(null);
          return res.data;
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
  const findByOrderId = useCallback(
    async (orderId: number) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO> = await findByOrderIdApi(orderId);
        if (res.code === 200) {
          setError(null);
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
  const findByUserId = useCallback(
    async (userId: number) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO[]> = await findByUserIdApi(userId);
        if (res.code === 200) {
          setError(null);
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
  const findByOrderIds = useCallback(
    async (orderIds: number[]) => {
      setLoading(true);
      setError(null);
      try {
        const res: ResultT<OrderAddressVO[]> = await findByOrderIdsApi(orderIds);
        if (res.code === 200) {
          setError(null);
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
    addressList,
    findPage,
    findById,
    deleteById,
    save,
    findByOrderId,
    findByUserId,
    findByOrderIds,
  };
};

export default useOrderAddress;
