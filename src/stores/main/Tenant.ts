import { useState, useCallback } from 'react';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { TenantType, PageTenantCondition } from '@/api/main/type/TenantType';
import { findById, findPage, save, deleteById } from '@/api/main/Tenant';

function useTenant() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tenantList, setTenantList] = useState<any>();

  const findPageApi = useCallback(async (data: PageType<PageTenantCondition>) => {
    setLoading(true);
    setError(null);
    try {
      const res = (await findPage(data)).data;
      if (res.code !== 200) {
        const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.message);
        message.warning(msg);
      }
      if (res.code === 200) {
        setLoading(false);
        setTenantList(res.data);
      }
      return res;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const findByIdApi = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = (await findById(id)).data;
      if (res.code === 200) {
        setLoading(false);
      }
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const deleteByIdApi = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = (await deleteById(id)).data;
      if (res.code === 200) {
        setLoading(false);
        message.success(res.msg || '删除成功');
      } else {
        message.error(res.msg || '删除失败');
      }
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const saveApi = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = (await save(data)).data;
      if (res.code === 200) {
        setLoading(false);
        message.success(res.msg || '保存成功');
      } else {
        message.error(res.msg || '保存失败');
      }
      return res.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  return { loading, error, tenantList, findPageApi, findByIdApi, deleteByIdApi, saveApi };
}

export default useTenant;
