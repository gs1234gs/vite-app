import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD} from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { SysRoleType } from "./type/SysRoleType";
const SYS_ROLE_PREFIX = `${SYS_API_PREFIX}/sysRole`


const findPage = (data: PageType<SysRoleType>) =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const findById = (id:number) =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
const findByNoId = () =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/findById`,
        method:GET_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const deleteById = (id:number) =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
const findRoleList = (userId: number) =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/findRoleList/${userId}`,
        method:DELETE_METHOD,
        data: userId
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

//添加或者修改角色
const save = (data:SysRoleType) =>{
    return sendRequest({
        url:`${SYS_ROLE_PREFIX}/save`,
        method:POST_METHOD,
        data: data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

export {save,deleteById,findById,findByNoId,findRoleList,findPage}