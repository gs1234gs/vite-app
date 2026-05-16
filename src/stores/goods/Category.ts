import { useState, useCallback } from 'react';
import type { PageType } from '@/api/type/PageType';
import { findPage, save, findById } from '@/api/goods/category/Category';
import type { ResultT, PageResult } from '@/api/type/ResultType';
import { message } from 'antd';
import type { CategorySaveVO, CategoryVO } from '@/api/goods/category/CategoryType';

function useCategory(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);


       const handleError = useCallback((err: any, defaultMsg: string) => {
    const errorMsg = err?.message || defaultMsg;
    message.error(errorMsg);
    setError(new Error(errorMsg));
  }, []);
              
   const findPageApi = useCallback(async (data: PageType<CategoryVO>) => {
    setLoading(true);
    setError(null);
    
    try {
      const res: ResultT<PageResult<CategoryVO>> = await findPage(data);
      
      if (res.code === 200) {
        message.success(res.msg)
        return res.data;
      } else {
        handleError(null, res.msg || '加载分类数据失败');
        return null;
      }
    } catch (err) {
      handleError(err, '网络错误，请稍后重试');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);




    const findByIdApi = useCallback(async (id: string) => { 
      setLoading(true);
      setError(null);
      
      try {
        const res: ResultT<CategoryVO> = await findById(id);
        
        if (res.code === 200) {
          message.success(res.msg)
          return res.data;
        } else {
          handleError(null, res.msg || '获取分类详情失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    }, [handleError])

    const deleteByIdApi = useCallback(async (id: string) => { 
      setLoading(true);
      setError(null);
      
      try {
        const res = await (await import('@/api/goods/category/Category')).deleteById(id);
        
        if (res.code === 200) {
          message.success(res.msg || '删除成功');
          return res.data;
        } else {
          handleError(null, res.msg || '删除失败');
          return null;
        }
      } catch (err) {
        handleError(err, '网络错误，请稍后重试');
        return null;
      } finally {
        setLoading(false);
      }
    }, [handleError])


       const saveApi = useCallback(async (data: CategorySaveVO) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await save(data);
      
      if (res.code === 200) {
        message.success(res.msg || '保存成功');
        return res.data;
      } else {
        handleError(null, res.msg || '保存失败');
        return null;
      }
    } catch (err) {
      handleError(err, '网络错误，请稍后重试');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);



  const findAllByProductIdApi = useCallback(async (productId: string) => { 
      setLoading(true);
      setError(null);
     
    },[])
    return { 
      loading,
       error, 
       findByIdApi,
       deleteByIdApi,
       saveApi,
      findAllByProductIdApi,
      findPageApi
      };
  
}


export default useCategory;