
import sendRequest from "../../axios";
import { GOODS_API_PREFIX} from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { RequestCursorPage } from "../../type/PageType";
import type { CursorPageResult, ResultT } from "../../type/ResultType";
import type { ProductCustomerVO } from "./RecommendProductType";

const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/category`

//添加或修改分类
const save= (data: any) :Promise<ResultT<string>>  =>{
return sendRequest<ResultT<string>>({
        url:`${DOODS_PRODUCT_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除商品
const deleteById= (id:string) :Promise<ResultT<any>>  =>{
return sendRequest<ResultT<any>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
// //批量删除商品
// const deleteAllById= (ids:Array<number>) :Promise<ResultT<number>>  =>{
// return sendRequest<ResultT<number>>({
//         url:`${DOODS_PRODUCT_PREFIX}/deleteAllById`,
//         method:DELETE_METHOD,
//         data:ids
//     })
//     .then(res=>res.data)
//     .catch(err=>{throw err})
// }
//游标查询
const findCursor = (data: RequestCursorPage< any>) : Promise<ResultT<CursorPageResult<ProductCustomerVO>>> =>{
    return sendRequest<ResultT<CursorPageResult<ProductCustomerVO>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findCursor`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: string) : Promise<ResultT<any>> =>{
    return sendRequest<ResultT<any>>({
        url:`${DOODS_PRODUCT_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,save,deleteById}