import sendRequest from "../../axios";
import { GOODS_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { SKUGroupByProductIdVO, SKUSaveVO, SKUVO } from "./SKUType";

const DOODS_PRODUCT_PREFIX = `${GOODS_API_PREFIX}/sku`;

// 全局错误处理封装
const handleApiError = (err: any) => {
  // 你可以定制错误消息，这里只是示例
  console.error("API请求失败", err);
  throw err;
};

// 后台分页查询
const findSkuPage = (data: PageType<SKUVO>): Promise<ResultT<PageResult<SKUGroupByProductIdVO>>> => {
  return sendRequest<ResultT<PageResult<SKUGroupByProductIdVO>>>({
    url: `${DOODS_PRODUCT_PREFIX}/findPage`,
    method: POST_METHOD,
    data: data,
  }).then((res) => res.data).catch(handleApiError);
};

// 添加或修改 SKU
const saveSku = (data: SKUSaveVO): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${DOODS_PRODUCT_PREFIX}/save`,
    method: POST_METHOD,
    data: data,
  }).then((res) => res.data).catch(handleApiError);
};

// 删除 SKU
const deleteBySkuId = (id: any): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${DOODS_PRODUCT_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  }).then((res) => res.data).catch(handleApiError);
};

// 批量删除
const deleteAllBySkuIds = (ids: Array<any>): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${DOODS_PRODUCT_PREFIX}/deleteAllById`,
    method: DELETE_METHOD,
    data: ids,
  }).then((res) => res.data).catch(handleApiError);
};

// 查询 SKU 详情
const findBySkuId = (id: string): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${DOODS_PRODUCT_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  }).then((res) => res.data).catch(handleApiError);
};

// 根据 productId 查询 SKU
const findByProductId = (productId: string): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${DOODS_PRODUCT_PREFIX}/findByProductId/${productId}`,
    method: GET_METHOD,
  }).then((res) => res.data).catch(handleApiError);
};

export {
  findBySkuId,
  findSkuPage,
  saveSku,
  deleteBySkuId,
  deleteAllBySkuIds,
  findByProductId,
};
