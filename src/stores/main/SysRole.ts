import { useState, useCallback } from 'react';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { PageType } from '@/api/type/PageType';
import { deleteById, findById, findPage,save } from '@/api/main/SysRole';
import type { SysRoleType } from '@/api/main/type/SysRoleType';
function useSysRole(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
       const [sysUserList, setSysUserList] = useState<any>()
    const findPageApi = useCallback(async (data:PageType<SysRoleType>) => {
      setLoading(true);
      setError(null);
      try {
        const res = (await findPage(data)).data;
        console.log(res);
        //  message.success("3333")
        // if(res.code !== 200){
          //  navigate('/sign-in');
          //  const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.message);
            // message.warning(msg);
            // message.error(msg)
        // }
        if(res.code === 200){
           message.success(res.msg)
          setLoading(false);
          setSysUserList(res.data)
        }
        return res;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])
    const findRoleByIdApi = useCallback(async (id: number) => { 
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

    const deleteByIdApi = useCallback(async (id: number) => { 
      setLoading(true);
      setError(null);
      try {
        const res = (await deleteById(id)).data.data;
        // setFindByIdMenu(res);
        return res;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
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

      const saveApi = useCallback(async (data:any) => { 
        setLoading(true);
      setError(null);
      try {
        const res = (await save(data)).data;
        if(res.code === 200){
          setLoading(false);
          message.success(res.msg)
        }
      
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
      },[])

    return {  loading, error,sysUserList,findPageApi ,findRoleByIdApi,deleteByIdApi,updateByIdApi,saveApi };
  
}


export default useSysRole;