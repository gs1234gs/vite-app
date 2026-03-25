import { findByRows, save } from '@/api/behavior/browse/Browse';
import type { UserBrowseSaveVO, UserBrowseVO } from '@/api/behavior/browse/BrowseType';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useUserBrowse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 修改点：移除 message.success，改为静默处理
  const saveBrowses = useCallback(async (data: UserBrowseSaveVO[]) => {
    if (!data || data.length === 0) return null;
    
    setLoading(true);
    try {
      const res = await save(data);
      if (res.code === HttpStatusCode.Ok) {
        // 不再弹出 success 提示
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      console.error('静默保存浏览记录失败:', err);
      // 生产环境不抛出错误，除非需要重试机制
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  const findBrowsesByRows = useCallback(async (rows?: number) => {
    setLoading(true);
    try {
      const res = await findByRows(rows);
      if (res.code === HttpStatusCode.Ok) {
        setLoading(false);
        return res.data as UserBrowseVO[];
      }
    } catch (err) {
      console.error('查询浏览记录失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  return {
    loading,
    error,
    saveBrowses,
    findBrowsesByRows,
  };
}

export default useUserBrowse;