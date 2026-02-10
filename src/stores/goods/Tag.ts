import { save, findPage, findById, deleteById, deleteAllById } from '@/api/goods/tag/Tag';
import type { TagSaveVO, TagVO } from '@/api/goods/tag/TagType';
import type { PageType } from '@/api/type/PageType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';

function useTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveTagApi = useCallback(async (saveData: TagSaveVO) => {
    setLoading(true);
    setError(null);
    try {
      const res = await save(saveData);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '保存成功');
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      setError(err as Error);
      message.error('保存失败');
    }
    setLoading(false);
    return null;
  }, []);

  const findTagByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findById(id);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '查询成功');
        setLoading(false);
        return res.data as TagVO;
      }
    } catch (err) {
      setError(err as Error);
      message.error('查询失败');
    }
    setLoading(false);
    return null;
  }, []);

  const deleteTagByIdApi = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteById(id);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '删除成功');
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      setError(err as Error);
      message.error('删除失败');
    }
    setLoading(false);
    return null;
  }, []);

  const deleteAllTagByIdApi = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteAllById(ids);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '批量删除成功');
        setLoading(false);
        return res.data;
      }
    } catch (err) {
      setError(err as Error);
      message.error('批量删除失败');
    }
    setLoading(false);
    return null;
  }, []);

  const findAllTagByApi = useCallback(async (data: PageType<TagVO>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await findPage(data);
      if (res.code === HttpStatusCode.Ok) {
        message.success(res.msg || '查询成功');
        setLoading(false);
        return res.data;
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
    saveTagApi,
    findTagByIdApi,
    deleteTagByIdApi,
    deleteAllTagByIdApi,
    findAllTagByApi,
  };
}

export default useTag;