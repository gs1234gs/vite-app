import sendRequest from "../../axios";
import { ORDER_API_PREFIX } from "../../prefix/PrefixApi";
import {
  DELETE_METHOD,
  GET_METHOD,
  POST_METHOD,
  PUT_METHOD,
} from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { PurchaseOrderDetailVO, PurChaseOrderSaveVO, PurchaseOrderSearchVO, PurChaseOrderVO } from "./OrderType";

const ORDER_PREFIX = `${ORDER_API_PREFIX}/purChaseOrder`;

/**
 * 后台分页查询所有订单
 */
const findPage = (
  data: PageType<PurChaseOrderVO>
): Promise<ResultT<PageResult<PurChaseOrderVO>>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findPage`,
    method: POST_METHOD,
    data,
  }).then((res) => res.data);
};

/**
 * 添加订单
 */
const save = (data: PurChaseOrderSaveVO): Promise<ResultT<string>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/save`,
    method: POST_METHOD,
    data,
  }).then((res) => res.data);
};

/**
 * 修改订单（更新）
 */
const updateById = (data: PurChaseOrderSaveVO): Promise<ResultT<string>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/updateById`,
    method: PUT_METHOD,
    data,
  }).then((res) => res.data);
};

/**
 * 根据订单 ID 查询订单详情
 */
const findById = (id: string): Promise<ResultT<PurchaseOrderDetailVO>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  }).then((res) => res.data);
};

/**
 * 根据用户 ID 查询该用户最近 N 条订单（不分页）
 */
const findByUserId = (
  userId: string,
  rows: number = 10
): Promise<ResultT<PurChaseOrderVO[]>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findByUserId`,
    method: GET_METHOD,
    params: { userId, rows }, // 注意：是 query 参数
  }).then((res) => res.data);
};

/**
 * 分页查询某用户的订单
 */
const findByUserIdPage = (
  data: PageType<PurchaseOrderSearchVO>
): Promise<ResultT<PageResult<PurChaseOrderVO>>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findByUserIdPage`,
    method: POST_METHOD,
    data,
  }).then((res) => res.data);
};

/**
 * 批量根据多个用户 ID 查询订单（每个用户最多返回 rows 条）
 */
const findByUserIds = (
  userIds: string[],
  rows: number = 10
): Promise<ResultT<PurChaseOrderVO[]>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findByUserIds`,
    method: POST_METHOD,
    data: userIds,
    params: { rows }, // rows 作为 query 参数
  }).then((res) => res.data);
};

/**
 * 查询最近 N 条订单（全局，不分用户）
 */
const findByRows = (rows: number = 10): Promise<ResultT<PurChaseOrderVO[]>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/findByRows`,
    method: GET_METHOD,
    params: { rows },
  }).then((res) => res.data);
};
//删除订单
const deletedById = (id:string): Promise<ResultT<boolean>> => {
  return sendRequest({
    url: `${ORDER_PREFIX}/deletedById/${id}`,
    method: DELETE_METHOD,
  }).then((res) => res.data);
};


export {
  findPage,
  save,
  updateById,
  findById,
  findByUserId,
  findByUserIdPage,
  findByUserIds,
  findByRows,
  deletedById
};