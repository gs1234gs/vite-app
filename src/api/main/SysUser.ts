import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD, PUT_METHOD } from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { SysUserType } from "./type/SysUserType";
const SYS_USER_PREFIX = `${SYS_API_PREFIX}/sysUser`

const findPage = (data: PageType<SysUserType>) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const findById = (id:number) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
const findByNoId = () =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/findById`,
        method:GET_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const deleteById = (id:number) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const updateUserById = (data:SysUserType) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/updateUserById`,
        method:PUT_METHOD,
        data: data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
const deleteUserByIds = (ids:Array<number>) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/deleteUserByIds`,
        method:DELETE_METHOD,
        data: ids
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
//添加或者修改用户
const save = (data:SysUserType) =>{
    return sendRequest({
        url:`${SYS_USER_PREFIX}/save`,
        method:POST_METHOD,
        data: data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

export {findPage,findById,deleteById,updateUserById,findByNoId,deleteUserByIds,save}