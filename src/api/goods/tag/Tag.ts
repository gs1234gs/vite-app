
import sendRequest from "../../axios";
import { GOODS_API_PREFIX} from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { TagSaveVO, TagVO } from "./TagType";
const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/tag`

//后台分页查询
const findPage = (data: PageType<TagVO>) : Promise<ResultT<PageResult<TagVO>>> =>{
    return sendRequest<ResultT<PageResult<TagVO>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加或修改
const save= (data : TagSaveVO) :Promise<ResultT<string>>  =>{
return sendRequest<ResultT<string>>({
        url:`${DOODS_PRODUCT_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除
const deleteById= (id:any) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除
const deleteAllById= (ids:Array<any>) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: any) : Promise<ResultT<any>> =>{
    return sendRequest<ResultT<any>>({
        url:`${DOODS_PRODUCT_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,findPage,save,deleteById,deleteAllById}