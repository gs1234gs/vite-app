
import { findByRows, save } from '@/api/behavior/click/Click';
import type { UserClickSaveVO, UserClickVO } from '@/api/behavior/click/ClickType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useUserClick() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveClick = useCallback(async (data: UserClickSaveVO) => {
    setLoading(true);
    try {
      const res = await save(data);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '点击记录保存成功');
        setLoading(false);
        return res.data; // string (id)
      }
    } catch (err) {
      console.error('保存点击记录失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  const findClicksByRows = useCallback(async (rows?: number) => {
    setLoading(true);
    try {
      const res = await findByRows(rows);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '查询成功');
        setLoading(false);
        return res.data as UserClickVO[];
      }
    } catch (err) {
      console.error('查询点击记录失败:', err);
    } finally {
      setLoading(false);
      setError(null);
    }
    return null;
  }, []);

  return {
    loading,
    error,
    saveClick,
    findClicksByRows,
  };
}

export default useUserClick;