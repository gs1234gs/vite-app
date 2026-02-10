// warehouse.ts

import sendRequest from "../../axios";
import { GOODS_API_PREFIX } from "../../prefix/PrefixApi";
import {
  DELETE_METHOD,
  GET_METHOD,
  POST_METHOD,
} from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { WarehouseSaveVO, WarehouseVO } from "./WarehouseType";

const WAREHOUSE_API_PREFIX = `${GOODS_API_PREFIX}/warehouse`;

/**
 * 分页查询仓库
 */
export const findPage = (
  data: PageType<WarehouseVO>
): Promise<ResultT<PageResult<WarehouseVO>>> => {
  return sendRequest<ResultT<PageResult<WarehouseVO>>>({
    url: `${WAREHOUSE_API_PREFIX}/findPage`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 保存（新增或编辑）仓库
 */
export const save = (
  data: WarehouseSaveVO
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${WAREHOUSE_API_PREFIX}/save`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 删除仓库
 */
export const deleteById = (id: string): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${WAREHOUSE_API_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 批量删除仓库
 */
export const deleteAllById = (ids: string[]): Promise<ResultT<any>> => {
  return sendRequest<ResultT<any>>({
    url: `${WAREHOUSE_API_PREFIX}/deleteAllByIds`,
    method: DELETE_METHOD,
    data: ids,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 查询单个仓库
 */
export const findById = (id: string): Promise<ResultT<WarehouseVO>> => {
  return sendRequest<ResultT<WarehouseVO>>({
    url: `${WAREHOUSE_API_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 查询所有仓库
 */
export const findAll = (): Promise<ResultT<WarehouseVO[]>> => {
  return sendRequest<ResultT<WarehouseVO[]>>({
    url: `${WAREHOUSE_API_PREFIX}/findAll`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};