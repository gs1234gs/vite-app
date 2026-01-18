import { useState, useCallback } from 'react';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { SysUserType } from '@/api/main/type/SysUserType';
import { findById, findPage, findSignInUserById } from '@/api/main/SysUser';
function useSysUser(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
       const [sysUserList, setSysUserList] = useState<any>()
    const findPageApi = useCallback(async (data:PageType<SysUserType>) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await findPage(data)).data;
        // console.log(res);
        if(res.code !== 200){
          //  navigate('/sign-in');
           const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.message);
            message.warning(msg);
            // message.error(msg)
        }
        if(res.code === 200){
          setLoading(false);
          setSysUserList(res.data)
        }
        return res;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])
    const findByIdApi = useCallback(async (id: number) => { 
      setLoading(true);
      setError(null);
      try {
        const res = (await findById(id)).data;
        if(res.code === 200){
          setLoading(false);
        }
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])

       const findSignInUserByIdApi = useCallback(async () => { 
      setLoading(true);
      setError(null);
      try {
        const res : any = await findSignInUserById();
        if(res.code === 200){
          setLoading(false);
        }
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])

    const deleteByIdApi = useCallback(async (id: number) => { 
      setLoading(true);
      setError(null);
      // try {
      //   const res = (await deleteById(id)).data.data;
      //   setFindByIdMenu(res);
      //   return res;
      // } catch (err) {
      //   setError(err as Error);
      //   throw err; 
      // }
    },[])
    const updateByIdApi = useCallback(async (id: number,data:any) => { 
      setLoading(true);
      setError(null);
      // try {
      //   const res = (await updateById(id,data)).data.data;
      //   setFindByIdMenu(res);
      //   return res;
      // } catch (err) {
      //   setError(err as Error);
      },[])

      const createApi = useCallback(async (data:any) => { 
      },[])

    return {  loading, error,sysUserList,findPageApi ,findByIdApi,deleteByIdApi,updateByIdApi,createApi,findSignInUserByIdApi };
  
}


export default useSysUser;