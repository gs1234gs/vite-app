import sendRequest from "../../axios";
import { AI_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { PageType } from "../../type/PageType";
import type { PageResult, ResultT } from "../../type/ResultType";
import type { BigModelVO, BigModelSaveVO, BigModelPageVO } from "./ModelType";

/**
 * /bigModel 接口前缀
 */
const BIG_MODEL_PREFIX = `${AI_API_PREFIX}/bigModel`;

/**
 * 保存大模型（新增或编辑）
 */
export const saveBigModel = (
  data: BigModelSaveVO
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${BIG_MODEL_PREFIX}/save`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 删除大模型
 */
export const deleteBigModelById = (
  id: string
): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${BIG_MODEL_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 分页查询大模型
 */
export const findBigModelPage = (
  data: PageType<BigModelPageVO>
): Promise<ResultT<PageResult<BigModelVO[]>>> => {
  return sendRequest<ResultT<PageResult<BigModelVO[]>>>({
    url: `${BIG_MODEL_PREFIX}/findPage`,
    method: POST_METHOD,
    data,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};

/**
 * 根据 ID 查询大模型详情
 */
export const findBigModelById = (
  id: string
): Promise<ResultT<BigModelVO>> => {
  return sendRequest<ResultT<BigModelVO>>({
    url: `${BIG_MODEL_PREFIX}/findById/${id}`,
    method: GET_METHOD,
  })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
};
