
import sendRequest from "../axios";
import { GOODS_API_PREFIX} from "../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../type/ConstRequestMethods";
import type { PageType, RequestCursorPage } from "../type/PageType";
import type { PageResult, ResultT } from "../type/ResultType";
import type { ProductSaveVO, ProductVO } from "./type/GoodsManagementType";
const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/product`

//后台分页查询
const findPage = (data: PageType<ProductVO>) : Promise<ResultT<PageResult<Array<ProductVO>>>> =>{
    return sendRequest<ResultT<PageResult<Array<ProductVO>>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findPage`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//添加商品或修改商品
const save= (data : ProductSaveVO) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/save`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

//删除商品
const deleteById= (id:number) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteById/${id}`,
        method:DELETE_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//批量删除商品
const deleteAllById= (ids:Array<number>) :Promise<ResultT<number>>  =>{
return sendRequest<ResultT<number>>({
        url:`${DOODS_PRODUCT_PREFIX}/deleteAllById`,
        method:DELETE_METHOD,
        data:ids
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}
//游标查询
//后台分页查询
const findCursor = (data: RequestCursorPage<ProductVO>) : Promise<ResultT<PageResult<Array<ProductVO>>>> =>{
    return sendRequest<ResultT<PageResult<Array<ProductVO>>>>({
        url:`${DOODS_PRODUCT_PREFIX}/findCursor`,
        method:POST_METHOD,
        data:data
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

const findById = (id: number) : Promise<ResultT<ProductVO>> =>{
    return sendRequest<ResultT<ProductVO>>({
        url:`${DOODS_PRODUCT_PREFIX}/findById/${id}`,
        method:GET_METHOD,
    })
    .then(res=>res.data)
    .catch(err=>{throw err})
}

export {findById,findCursor,findPage,save,deleteById,deleteAllById}