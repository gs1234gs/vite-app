import { deleteById, findByRows, save, findByPage } from '@/api/behavior/collect/Collect';
import type { UserCollectSaveVO, UserCollectVO } from '@/api/behavior/collect/CollectType';
import type { PageType } from '@/api/type/PageType';
import type { PageResult } from '@/api/type/ResultType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

// 定义 Hook 返回值的类型
interface UseUserCollectReturn {
  loading: boolean;
  error: Error | null;
  saveCollect: (data: UserCollectSaveVO) => Promise<string | null>;
  findCollectsByRows: (rows?: number) => Promise<UserCollectVO[] | null>;
  deleteCollectById: (id: string) => Promise<boolean | null>;
  findCollectsByPage: (params: PageType<any>) => Promise<PageResult<UserCollectVO> | null>;
}

function useUserCollect(): UseUserCollectReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 通用请求处理函数
   */
  const handleRequest = async <T,>(
    requestFn: () => Promise<{ code: number; msg?: string; data: T }>,
    successMsg: string,
    errorMsg: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await requestFn();

      if (res.code === HttpStatusCode.Ok) {
        if (successMsg) {
          message.success(res.msg || successMsg);
        }
        return res.data;
      } else {
        const errMsg = res.msg || errorMsg;
        message.warning(errMsg);
        setError(new Error(errMsg));
        return null;
      }
    } catch (err: any) {
      console.error(`${errorMsg}:`, err);
      const errMsg = err?.response?.data?.msg || err?.message || '网络请求失败';
      message.error(errMsg);
      setError(err instanceof Error ? err : new Error(errMsg));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveCollect = useCallback(async (data: UserCollectSaveVO): Promise<string | null> => {
    return handleRequest(
      () => save(data),
      '收藏成功',
      '保存收藏失败'
    );
  }, []);

  const findCollectsByRows = useCallback(async (rows?: number): Promise<UserCollectVO[] | null> => {
    return handleRequest(
      () => findByRows(rows),
      '',
      '查询收藏记录失败'
    );
  }, []);

  const deleteCollectById = useCallback(async (id: string): Promise<boolean | null> => {
    return handleRequest(
      () => deleteById(id),
      '取消收藏成功',
      '删除收藏失败'
    );
  }, []);

  /**
   * 分页查询收藏
   */
  const findCollectsByPage = useCallback(
    async (params: PageType<any>): Promise<PageResult<any> | null> => {
      return handleRequest(
        () => findByPage(params),
        '',
        '分页查询收藏记录失败'
      );
    },
    []
  );

  return {
    loading,
    error,
    saveCollect,
    findCollectsByRows,
    deleteCollectById,
    findCollectsByPage,
  };
}

export default useUserCollect;