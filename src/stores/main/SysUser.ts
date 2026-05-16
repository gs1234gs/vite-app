import { useState, useCallback } from 'react';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import type { SysUserType } from '@/api/main/type/SysUserType';
import { findById, findPage, findSignInUserById, updateUserById, save, updateSignInUser, deleteById } from '@/api/main/SysUser';
function useSysUser(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
       const [sysUserList, setSysUserList] = useState<any>()
    const findPageApi = useCallback(async (data:PageType<SysUserType>) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await findPage(data)).data;
        
        if(res.code === 200){
          setLoading(false);
          setSysUserList(res.data);
          return res;
        } else {
          // ❌ code !== 200 时显示错误消息
          message.error(res.msg || '查询失败');
          setLoading(false);
          return res;
        }
      } catch (err) {
        setError(err as Error);
        message.error('网络异常，请稍后重试');
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
          return res.data;
        } else {
          // ❌ code !== 200 时显示错误消息
          message.error(res.msg || '查询失败');
          setLoading(false);
          return null;
        }
      } catch (err) {
        setError(err as Error);
        message.error('网络异常，请稍后重试');
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
          // ❌ code !== 200 时显示错误消息
          const errorMsg = res.data?.msg || '获取用户信息失败';
          console.error('❌ API 返回错误:', res.data);
          message.error(errorMsg);
          setLoading(false);
          return null;
        }
      } catch (err) {
        console.error('❌ API 调用异常:', err);
        setError(err as Error);
        message.error('网络异常，请稍后重试');
        throw err; 
      }
    },[])

    const deleteByIdApi = useCallback(async (id: number) => { 
      setLoading(true);
      setError(null);
      try {
        const res = (await deleteById(id)).data;
        
        if (res.code === 200) {
          setLoading(false);
          message.success(res.msg || '删除成功');
          return res;
        } else {
          // ❌ code !== 200 时显示错误消息
          message.error(res.msg || '删除失败');
          setLoading(false);
          return res;
        }
      } catch (err) {
        setError(err as Error);
        message.error('网络异常，请稍后重试');
        throw err; 
      }
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
            return res.data;
          } else {
            // ❌ code !== 200 时显示错误消息
            message.error(res.msg || '保存失败');
            setLoading(false);
            return null;
          }
        } catch (err) {
          setError(err as Error);
          message.error('网络异常，请稍后重试');
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
            return res.data;
          } else {
            // ❌ code !== 200 时显示错误消息
            message.error(res.msg || '更新失败');
            setLoading(false);
            return null;
          }
        } catch (err) {
          setError(err as Error);
          message.error('网络异常，请稍后重试');
          throw err;
        }
      }, []);

    return {  loading, error,sysUserList,findPageApi ,findByIdApi,deleteByIdApi,updateByIdApi,createApi,findSignInUserByIdApi,saveApi,updateSignInUserApi };
  
}


export default useSysUser;
