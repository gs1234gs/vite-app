import { save,findCursor,findById,deleteById,deleteAllById,findPage } from '@/api/goods/product/Product';
import type { ProductVO } from '@/api/goods/product/ProductType';
import type { PageType } from '@/api/type/PageType';
import { message } from 'antd';
import { HttpStatusCode } from 'axios';
import { useState, useCallback } from 'react';
function useProduct(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
              
    const saveProductApi = useCallback(async (saveData:any) => {
      setLoading(true)
     const res = await save(saveData)
     if(res.code === HttpStatusCode.Ok){
      message.success(res.msg)
      setLoading(false)
      return res.data
     }
    setLoading(false);
    setError(null);
    return null;
    },[])
    const findByIdApi = useCallback(async (id: any) => { 
      setLoading(true);
       const res = await findById(id)
       if(res.code ===HttpStatusCode.Ok){
        message.success(res.msg)
        setLoading(false)
        return res.data
       }
       setLoading(false)
          setError(null);
       return null;
    },[])

    const deleteByIdApi = useCallback(async (id: any) => { 
      setLoading(true);
      const res = await deleteById(id)
      if(res.code === HttpStatusCode.Ok){
        message.success(res.msg)
        setLoading(false)
        return res.data
      }
      setLoading(false)
      setError(null);
      return null;
    },[])
      const deleteAllByIdApi = useCallback(async (ids: any) => { 
        setLoading(true);
       const res = await deleteAllById(ids)
       if(res.code === HttpStatusCode.Ok){
        message.success(res.msg)
        setLoading(false)
        return res.data
       }
       setLoading(false);
      setError(null);
      return null;
      },[])
  const findAllByApi = useCallback(async (data: PageType<ProductVO>) => { 
      setLoading(true);

     const res = await findPage(data)
     if(res.code === HttpStatusCode.Ok){
      message.success(res.msg)
      setLoading(false)
      return res.data
     }
     setLoading(false)
     setError(null);
    return null;
     
    },[])
    return { 
      loading,
       error, 
       findByIdApi,
       deleteByIdApi,
       deleteAllByIdApi,
       findAllByApi,
       saveProductApi
      };
  
}


export default useProduct;