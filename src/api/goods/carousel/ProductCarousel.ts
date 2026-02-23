// src/api/product-carousal/product-carousal.api.ts

import sendRequest from "@/api/axios";
import { GOODS_API_PREFIX } from "@/api/prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "@/api/type/ConstRequestMethods";
import type { ResultT } from "@/api/type/ResultType";
import type { ProductCarousalSaveVO, ProductCarousalVO } from "./ProductCarouselType";
const PRODUCT_CAROUSAL_PREFIX = `${GOODS_API_PREFIX}/product/carousal`;

/**
 * 保存轮播图（新增或更新）
 * POST /product/carousal/save
 */
export const saveProductCarousal = (
  data: ProductCarousalSaveVO
): Promise<ResultT<ProductCarousalVO>> => {
  return sendRequest<ResultT<ProductCarousalVO>>({
    url: `${PRODUCT_CAROUSAL_PREFIX}/save`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 查询所有轮播图（不分页）
 * GET /product/carousal/findAll
 */
export const findAllProductCarousals = (): Promise<
  ResultT<ProductCarousalVO[]>
> => {
  return sendRequest<ResultT<ProductCarousalVO[]>>({
    url: `${PRODUCT_CAROUSAL_PREFIX}/findAll`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 删除轮播图
 * DELETE /product/carousal/deleteById/{id}
 */
export const deleteProductCarousalById = (id: string): Promise<ResultT<void>> => {
  return sendRequest<ResultT<void>>({
    url: `${PRODUCT_CAROUSAL_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const findByid = (id: string): Promise<ResultT<ProductCarousalVO>> => {
  return sendRequest<ResultT<ProductCarousalVO>>({
    url: `${PRODUCT_CAROUSAL_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

export const findByType = (type: number): Promise<ResultT<Array<ProductCarousalVO>>> => {
  return fetch(`${PRODUCT_CAROUSAL_PREFIX}/findByType/${type}`, {
    method: GET_METHOD,
    headers: {
      'Content-Type': 'application/json',
      // 如果需要认证，添加 token
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include', // 如果需要携带 cookie
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as ResultT<Array<ProductCarousalVO>>;
    })
    .catch((err) => {
      console.error('获取轮播图失败:', err);
      throw err;
    });
};

export const deleteProductCarousalBatch = (
  ids: string[]
): Promise<ResultT<void>> => {
  return sendRequest<ResultT<void>>({
    url: `${PRODUCT_CAROUSAL_PREFIX}/deleteBatch`,
    method: POST_METHOD, 
    data: ids,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};