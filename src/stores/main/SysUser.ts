import { useState, useCallback } from 'react';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { SysUserType } from '@/api/main/type/SysUserType';
import { findById, findPage, findSignInUserById, updateUserById, save, updateSignInUser } from '@/api/main/SysUser';
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
        console.log(' API 原始响应:', res);
        if(res.data && res.data.code === 200){
          setLoading(false);
          console.log('✅ 用户数据:', res.data.data);
          return res.data.data;
        } else {
          console.error('❌ API 返回错误:', res.data);
          return null;
        }
      } catch (err) {
        console.error('❌ API 调用异常:', err);
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
      try {
        // 将 id 合并到 data 对象中
        const updateData = { ...data, id };
        const res = (await updateUserById(updateData)).data.data;
        return res;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])

      const createApi = useCallback(async (data:any) => { 
      },[])

      const saveApi = useCallback(async (data: SysUserType) => {
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

      const updateSignInUserApi = useCallback(async (data: SysUserType) => {
        setLoading(true);
        setError(null);
        try {
          const res = (await updateSignInUser(data)).data;
          if (res.code === 200) {
            setLoading(false);
            message.success(res.msg || '更新成功');
          } else {
            message.error(res.msg || '更新失败');
          }
          return res.data;
        } catch (err) {
          setError(err as Error);
          throw err;
        }
      }, []);

    return {  loading, error,sysUserList,findPageApi ,findByIdApi,deleteByIdApi,updateByIdApi,createApi,findSignInUserByIdApi,saveApi,updateSignInUserApi };
  
}


export default useSysUser;
