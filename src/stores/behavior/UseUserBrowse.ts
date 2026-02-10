
import { findByRows, save } from '@/api/behavior/browse/Browse';
import type { UserBrowseSaveVO, UserBrowseVO } from '@/api/behavior/browse/BrowseType';

import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useUserBrowse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveBrowses = useCallback(async (data: UserBrowseSaveVO[]) => {
    setLoading(true);
    try {
      const res = await save(data);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '浏览记录保存成功');
        setLoading(false);
        return res.data; // string[]
      }
    } catch (err) {
      console.error('保存浏览记录失败:', err);
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
        message.success(res.msg || '查询成功');
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