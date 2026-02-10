import sendRequest from "@/api/axios";
import { ORDER_API_PREFIX } from "@/api/prefix/PrefixApi";
import {
  DELETE_METHOD,
  GET_METHOD,
  POST_METHOD,
} from "@/api/type/ConstRequestMethods";
import type { PageType } from "@/api/type/PageType";
import type { PageResult, ResultT } from "@/api/type/ResultType";
import type { OrderAddressSaveVO, OrderAddressVO } from "./OrderAddressType"; // 确保路径正确

const ADDRESS_PREFIX = `${ORDER_API_PREFIX}/address`;

/**
 * 后台分页查询地址列表
 */
const findPage = (
  data: PageType<OrderAddressVO>
): Promise<ResultT<PageResult<OrderAddressVO>>> => {
  return sendRequest<ResultT<PageResult<OrderAddressVO>>>({
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
const save = (data: OrderAddressSaveVO): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
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
const deleteById = (id: string): Promise<ResultT<void>> => {
  return sendRequest<ResultT<void>>({
    url: `${ADDRESS_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

// 注意：后端未实现 /deleteAllById，如需使用请先在后端添加该接口
// /**
//  * 批量删除地址（后端暂未实现）
//  */
// const deleteAllById = (ids: string[]): Promise<ResultT<void>> => {
//   return sendRequest<ResultT<void>>({
//     url: `${ADDRESS_PREFIX}/deleteAllById`,
//     method: DELETE_METHOD,
//     data: ids,
//   })
//     .then((res) => res.data)
//     .catch((err) => {
//       throw err;
//     });
// };

/**
 * 根据地址 ID 查询单个地址
 */
const findById = (id: string): Promise<ResultT<OrderAddressVO>> => {
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
const findByOrderId = (orderId: string): Promise<ResultT<OrderAddressVO>> => {
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
const findByUserId = (userId: string): Promise<ResultT<OrderAddressVO[]>> => {
  return sendRequest<ResultT<OrderAddressVO[]>>({
    url: `${ADDRESS_PREFIX}/findByUserId/${userId}`, // ✅ 修正：原错误写成 /findByOrderId
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

// 如果业务需要批量根据订单ID查地址，可补充以下方法（后端已支持）
/**
 * 批量根据订单 IDs 查询地址列表
 */
const findByOrderIds = (orderIds: string[]): Promise<ResultT<OrderAddressVO[]>> => {
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

// 导出所有方法
export {
  findById,
  findPage,
  save,
  deleteById,
  // deleteAllById, // 暂不导出，因后端未实现
  findByOrderId,
  findByUserId,
  findByOrderIds, // 新增导出
};