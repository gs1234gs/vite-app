
import sendRequest from "../../axios";
import { ORDER_API_PREFIX} from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { PurChaseOrderVO } from "../order/OrderType";
const ADDRESS_PREFIX = `${ORDER_API_PREFIX}/address`

//后台分页查询
const findPage = (data: PageType<PurChaseOrderVO>) : Promise<ResultT<PageResult<PurChaseOrderVO>>> =>{
    return sendRequest<ResultT<PageResult<PurChaseOrderVO>>>({
        url:`${ADDRESS_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加或修改
const save= (data : PurChaseOrderVO) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${ADDRESS_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除
const deleteById= (id:any) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${ADDRESS_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除
const deleteAllById= (ids:Array<any>) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${ADDRESS_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: any) : Promise<ResultT<PurChaseOrderVO>> =>{
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