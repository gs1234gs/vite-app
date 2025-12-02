
import sendRequest from "../axios";
import { GOODS_API_PREFIX} from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { PageResult, ResultT } from "../type/ResultType";
import type { SKUFindVo, SKUSaveVO, SKUVO } from "./type/GoodsManagementType";
const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/sku`

//后台分页查询
const findPage = (data: PageType<SKUFindVo>) : Promise<ResultT<PageResult<Array<SKUFindVo>>>> =>{
    return sendRequest<ResultT<PageResult<Array<SKUFindVo>>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加sku或修改sku
const save= (data : SKUSaveVO) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除sku
const deleteById= (id:number) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除
const deleteAllById= (ids:Array<number>) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: number) : Promise<ResultT<SKUVO>> =>{
    return sendRequest<ResultT<SKUVO>>({
        url:`${DOODS_PRODUCT_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,findPage,save,deleteById,deleteAllById}