import { useState, useCallback } from 'react';
import signIn from "../../api/SignInUp/SignIn";
import type { SignInType } from "../../types/SignInUpType";
import useSysMenu from '../main/SysMenu';
import { cacheSession } from '../../utils/cache';
import { SIGN_IN_CONST_TOKEN } from '../../const/SignInConst';
function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataResult, setDataResult] = useState<any>(null); // 根据你的接口返回类型改成具体类型
  const { sysMenuApi } = useSysMenu();
  
  const signInApi = useCallback(async (formData: SignInType) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await signIn(formData);
      setDataResult(res.data);
      // console.log(res.data);
      // 如果需要，还可以返回数据
      cacheSession.setCache(SIGN_IN_CONST_TOKEN, res.data.data)
      if (res.data.code === 200) {
        sysMenuApi();
       
      }
      return res;
    } catch (err) {
      setError(err as Error);
      throw err; // 可以让调用者catch
    } finally {
      setLoading(false);
    }
  }, []);

  return { signInApi, loading, error, dataResult };
}

export default useSignIn;
