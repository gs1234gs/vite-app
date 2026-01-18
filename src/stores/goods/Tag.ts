import { useState, useCallback } from 'react';
function useOrderAddress(){
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
              
    const sysMenuApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    },[])
    const findByIdApi = useCallback(async (id: any) => { 
      setLoading(true);
      setError(null);
    },[])

    const deleteByIdApi = useCallback(async (id: any) => { 
      setLoading(true);
      setError(null);
    },[])
      const saveApi = useCallback(async (data: any) => { 
        setLoading(true);
      setError(null);

      },[])
  const findAllByRoleIdApi = useCallback(async (roleId: any) => { 
      setLoading(true);
      setError(null);
     
    },[])
    return { 
      loading,
       error, 
       sysMenuApi,
       findByIdApi,
       deleteByIdApi,
       saveApi,
       findAllByRoleIdApi,
      };
  
}


export default useOrderAddress;