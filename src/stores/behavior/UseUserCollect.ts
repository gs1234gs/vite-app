

import { deleteById, findByRows, save } from '@/api/behavior/collect/Collect';
import type { UserCollectSaveVO, UserCollectVO } from '@/api/behavior/collect/CollectType';

import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useUserCollect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveCollect = useCallback(async (data: UserCollectSaveVO) => {
    setLoading(true);
    try {
      const res = await save(data);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '收藏成功');
        setLoading(false);
        return res.data; // string (id)
      }
    } catch (err) {
      console.error('保存收藏失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  const findCollectsByRows = useCallback(async (rows?: number) => {
    setLoading(true);
    try {
      const res = await findByRows(rows);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '查询成功');
        setLoading(false);
        return res.data as UserCollectVO[]; // 明确类型
      }
    } catch (err) {
      console.error('查询收藏记录失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  const deleteCollectById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await deleteById(id);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '取消收藏成功');
        setLoading(false);
        return res.data; // boolean
      }
    } catch (err) {
      console.error('删除收藏失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  return {
    loading,
    error,
    saveCollect,
    findCollectsByRows,
    deleteCollectById,
  };
}

export default useUserCollect;