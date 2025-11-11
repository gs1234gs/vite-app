import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { SysMenuType } from "./type/SysMenuType";
const SYS_MENU_PREFIX = `${SYS_API_PREFIX}/sysMenu`

const menuTree = () =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/findByUserId`,
        method:GET_METHOD
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

const findAll = () =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/findAll`,
        method:GET_METHOD
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

//根据id获取菜单
const findById = (id:number) =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/findById/${id}`,
        method:GET_METHOD
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
//添加菜单或者更新菜单
const save =(data:SysMenuType) =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

//根据id删除菜单
const deleteById =(id:number) =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res)
    .catch(err=>{throw err})
}

//根据角色id获取
//根据id获取菜单
const findAllByRoleId = (userId:number) =>{
    return sendRequest({
        url:`${SYS_MENU_PREFIX}/findMenuByRoleId/${userId}`,
        method:GET_METHOD
    })
    .then(res=>res)
    .catch(err=>{throw err})
}
// export default menuTree;
export {menuTree,findAll,findById,save,deleteById,findAllByRoleId}