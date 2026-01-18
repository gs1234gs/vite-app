import { useState, useCallback } from 'react';
import { menuTree,findAll,findById, findAllByRoleId,save,deleteById } from '@/api/main/SysMenu';
import { cacheSession } from '@/utils/cache';
import { SYSTEM_MENU_BAR_CONST_KEY } from '@/const/SiderBarConst';
import { useNavigate } from 'react-router-dom';
import { HttpErrorHelper } from '@/utils/http/HttpErrorHelper';
import { message } from 'antd';
import type { SysMenuType } from '@/api/main/type/SysMenuType';
function useSysMenu(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      const [dataSysMenu, setDataSysMenu] = useState<any>(() => {
          // 初始加载时尝试从浏览器中取缓存
          const cached = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);
          return cached || null;
        });
      const [allSysMenu, setAllSysMenu] = useState<any>(() => {
        // 初始加载时尝试从浏览器中取缓存
        const cached = cacheSession.getCache(SYSTEM_MENU_BAR_CONST_KEY);
        return cached || null;
      });
      const [findByIdMenu, setFindByIdMenu] = useState<any>(null); 
      const [findAllByRoleIdMenu, setFindAllByRoleIdMenu] = useState<any>();
      const [menuId, setMenuId] = useState<any>();
    const navigate = useNavigate();
              
    const sysMenuApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await menuTree()).data.data;
      setDataSysMenu(res);
      cacheSession.setCache(SYSTEM_MENU_BAR_CONST_KEY, res);
      //  message.success("登陆成功")
      navigate('/main/home');
      return res;
    } catch (err) {
      setError(err as Error);
      throw err; 
    }
    },[])

    const findAllApi = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = (await findAll()).data;
        // console.log(res);
        if(res.code !== 200){
          //  navigate('/sign-in');
           const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.message);
            message.warning(msg);
        }
        if(res.code === 200){
          setLoading(false);
        }
        setAllSysMenu(res.data);
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
          setFindByIdMenu(res.data);
          // console.log("------",findByIdMenu)
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
        const res = (await deleteById(id)).data;
        // setFindByIdMenu(res);
        if(res.code===200){
          setLoading(false);
            message.success(res.msg);
        }
          if(res.code !== 200){
          //  navigate('/sign-in');
            message.error(res.msg);
        }
        return res;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])
      const saveApi = useCallback(async (data:SysMenuType) => { 
        setLoading(true);
      setError(null);
        try {
        const res = (await save(data)).data;
        
        if(res.code === 200){
          setLoading(false);
          setMenuId(res.data);
          message.success(res.msg)
        }
        if(res.code !== 200){
          //  navigate('/sign-in');
           const msg = HttpErrorHelper.getFriendlyMessage(res.code, res.message);
            message.warning(msg);
        }
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }

      },[])
  const findAllByRoleIdApi = useCallback(async (roleId: number) => { 
      setLoading(true);
      setError(null);
      try {
        const res = (await findAllByRoleId(roleId)).data;
        if(res.code === 200){
          setLoading(false);
          setFindAllByRoleIdMenu(res.data);
        }
        return res.data;
      } catch (err) {
        setError(err as Error);
        throw err; 
      }
    },[])
    return { 
      dataSysMenu, 
      loading,
       error, 
       sysMenuApi,
       allSysMenu,
       findAllApi ,
       findByIdMenu,
       findByIdApi,
       deleteByIdApi,
       saveApi,
       menuId,
       findAllByRoleIdApi,
       findAllByRoleIdMenu 
      };
  
}


export default useSysMenu;