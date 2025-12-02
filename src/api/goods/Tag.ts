
import sendRequest from "../axios";
import { GOODS_API_PREFIX} from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { PageType } from "../type/PageType";
import type { PageResult, ResultT } from "../type/ResultType";
import type {TagSaveVo, TagVO } from "./type/GoodsManagementType";
const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/tag`

//后台分页查询
const findPage = (data: PageType<TagVO>) : Promise<ResultT<PageResult<Array<TagVO>>>> =>{
    return sendRequest<ResultT<PageResult<Array<TagVO>>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加或修改
const save= (data : TagSaveVo) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除
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

const findById = (id: number) : Promise<ResultT<TagVO>> =>{
    return sendRequest<ResultT<TagVO>>({
        url:`${DOODS_PRODUCT_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,findPage,save,deleteById,deleteAllById}