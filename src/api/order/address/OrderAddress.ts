import sendRequest from "@/api/axios";
import { ORDER_API_PREFIX } from "@/api/prefix/PrefixApi";
import {
  DELETE_METHOD,
  GET_METHOD,
  POST_METHOD,
} from "@/api/type/ConstRequestMethods";
import type { PageType } from "@/api/type/PageType";
import type { PageResult, ResultT } from "@/api/type/ResultType";
import type { OrderAddressSaveVO, OrderAddressVO } from "./OrderAddressType";

const ADDRESS_PREFIX = `${ORDER_API_PREFIX}/address`;

/**
 * 后台分页查询地址列表
 */
export const findPageApi = (
  data: PageType<OrderAddressVO>
): Promise<ResultT<PageResult<OrderAddressVO[]>>> => {
  return sendRequest<ResultT<PageResult<OrderAddressVO[]>>>({
    url: `${ADDRESS_PREFIX}/findPage`,
    method: POST_METHOD,
    data: data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 添加或修改地址
 */
export const saveApi = (data: OrderAddressSaveVO): Promise<ResultT<number>> => {
  return sendRequest<ResultT<number>>({
    url: `${ADDRESS_PREFIX}/save`,
    method: POST_METHOD,
    data: data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 删除地址
 */
export const deleteByIdApi = (id: number): Promise<ResultT<void>> => {
  return sendRequest<ResultT<void>>({
    url: `${ADDRESS_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据地址 ID 查询单个地址
 */
export const findByIdApi = (id: number): Promise<ResultT<OrderAddressVO>> => {
  return sendRequest<ResultT<OrderAddressVO>>({
    url: `${ADDRESS_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据订单 ID 查询对应地址
 */
export const findByOrderIdApi = (orderId: number): Promise<ResultT<OrderAddressVO>> => {
  return sendRequest<ResultT<OrderAddressVO>>({
    url: `${ADDRESS_PREFIX}/findByOrderId/${orderId}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据用户 ID 查询该用户的所有地址
 */
export const findByUserIdApi = (userId: number): Promise<ResultT<OrderAddressVO[]>> => {
  return sendRequest<ResultT<OrderAddressVO[]>>({
    url: `${ADDRESS_PREFIX}/findByUserId/${userId}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 批量根据订单 IDs 查询地址列表
 */
export const findByOrderIdsApi = (orderIds: number[]): Promise<ResultT<OrderAddressVO[]>> => {
  return sendRequest<ResultT<OrderAddressVO[]>>({
    url: `${ADDRESS_PREFIX}/findByOrderIds`,
    method: POST_METHOD,
    data: orderIds,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};