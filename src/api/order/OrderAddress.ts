
import sendRequest from "../axios";
import { ORDER_API_PREFIX} from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { PageResult, ResultT } from "../type/ResultType";
import type { PurChaseOrderVO } from "./type/OrderType";
const ADDRESS_PREFIX = `${ORDER_API_PREFIX}/address`

//后台分页查询
const findPage = (data: PageType<PurChaseOrderVO>) : Promise<ResultT<PageResult<Array<PurChaseOrderVO>>>> =>{
    return sendRequest<ResultT<PageResult<Array<PurChaseOrderVO>>>>({
        url:`${ADDRESS_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加或修改
const save= (data : PurChaseOrderVO) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${ADDRESS_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除
const deleteById= (id:number) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${ADDRESS_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除
const deleteAllById= (ids:Array<number>) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${ADDRESS_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: number) : Promise<ResultT<PurChaseOrderVO>> =>{
    return sendRequest<ResultT<PurChaseOrderVO>>({
        url:`${ADDRESS_PREFIX   }/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

 //根据订单id获取 地址
const findByOrderId = (id: string) : Promise<ResultT<PurChaseOrderVO>> =>{
    return sendRequest<ResultT<PurChaseOrderVO>>({
        url:`${ADDRESS_PREFIX   }/findByOrderId/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//根据订单id获取 地址
const findByUserId = (id: string) : Promise<ResultT<PurChaseOrderVO>> =>{
    return sendRequest<ResultT<PurChaseOrderVO>>({
        url:`${ADDRESS_PREFIX   }/findByOrderId/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
export {findById,findPage,save,deleteById,deleteAllById,findByOrderId,findByUserId}