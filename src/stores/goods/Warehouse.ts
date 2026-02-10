// useWarehouse.ts

import { save, findPage, findById, deleteById, deleteAllById } from '@/api/goods/warehouse/Warehouse';
import type { WarehouseSaveVO, WarehouseVO } from '@/api/goods/warehouse/WarehouseType';
import type { PageType } from '@/api/type/PageType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useWarehouse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 保存仓库（新增或编辑）
   */
  const saveWarehouseApi = useCallback(async (saveData: WarehouseSaveVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await save(saveData);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '保存成功');
        setLoading(false);
        return res.data; // 返回仓库 ID（字符串）
      } else {
        message.error(res.msg || '保存失败');
      }
    } catch (err) {
      setError(err as Error);
      message.error('保存失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 根据 ID 查询仓库详情
   */
  const findWarehouseByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findById(id);
      if (res.code === HttpStatusCode.Ok) {
        setLoading(false);
        return res.data as WarehouseVO;
      } else {
        message.error(res.msg || '查询失败');
      }
    } catch (err) {
      setError(err as Error);
      message.error('查询失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 删除单个仓库
   */
  const deleteWarehouseByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteById(id);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '删除成功');
        setLoading(false);
        return res.data; // 通常返回删除数量（如 1）
      } else {
        message.error(res.msg || '删除失败');
      }
    } catch (err) {
      setError(err as Error);
      message.error('删除失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 批量删除仓库
   */
  const deleteAllWarehouseByIdApi = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteAllById(ids);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '批量删除成功');
        setLoading(false);
        return res.data; // 返回删除数量
      } else {
        message.error(res.msg || '批量删除失败');
      }
    } catch (err) {
      setError(err as Error);
      message.error('批量删除失败');
    }
    setLoading(false);
    return null;
  }, []);

  /**
   * 分页查询仓库列表
   */
  const findWarehousePageApi = useCallback(async (data: PageType<WarehouseVO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findPage(data);
      if (res.code === HttpStatusCode.Ok) {
        setLoading(false);
        return res.data; // PageResult<WarehouseVO>
      } else {
        message.error(res.msg || '查询失败');
      }
    } catch (err) {
      setError(err as Error);
      message.error('查询失败');
    }
    setLoading(false);
    return null;
  }, []);

  return {
    loading,
    error,
    saveWarehouseApi,
    findWarehouseByIdApi,
    deleteWarehouseByIdApi,
    deleteAllWarehouseByIdApi,
    findWarehousePageApi,
  };
}

export default useWarehouse;