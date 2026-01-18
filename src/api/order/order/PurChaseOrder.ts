
import sendRequest from "../../axios";
import { ORDER_API_PREFIX} from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { PurChaseOrderVO } from "./OrderType";
const ORDER_PREFIX = `${ORDER_API_PREFIX}/purChaseOrder`

//后台分页查询
const findPage = (data: PageType<PurChaseOrderVO>) : Promise<ResultT<PageResult<PurChaseOrderVO>>> =>{
    return sendRequest<ResultT<PageResult<PurChaseOrderVO>>>({
        url:`${ORDER_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加或修改
const save= (data : PurChaseOrderVO) :Promise<ResultT<string>>  =>{
return sendRequest<ResultT<string>>({
        url:`${ORDER_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除
const deleteById= (id:string) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${ORDER_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除
const deleteAllById= (ids:Array<number>) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${ORDER_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: number) : Promise<ResultT<PurChaseOrderVO>> =>{
    return sendRequest<ResultT<PurChaseOrderVO>>({
        url:`${ORDER_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,findPage,save,deleteById,deleteAllById}