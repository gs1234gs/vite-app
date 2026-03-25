import sendRequest from "../../axios";
import { BEHAVIOR_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { ResultT } from "../../type/ResultType";
import type { UserCollectSaveVO, UserCollectVO } from "./CollectType";
import type { PageType } from "../../type/PageType"; // 假设你有分页类型
import type { PageResult } from "../../type/ResultType"; // 假设你有分页结果类型

const COLLECT_PREFIX = `${BEHAVIOR_API_PREFIX}/collect`;

/**
 * 保存用户收藏记录
 */
const save = (data: UserCollectSaveVO): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${COLLECT_PREFIX}/save`,
    method: POST_METHOD,
    data: data,
  }).then((res) => res.data);
};

/**
 * 查询用户收藏记录（可限制条数）
 */
const findByRows = (rows?: number): Promise<ResultT<UserCollectVO[]>> => {
  const params = rows !== undefined ? { rows } : {};
  return sendRequest<ResultT<UserCollectVO[]>>({
    url: `${COLLECT_PREFIX}/findByRows`,
    method: GET_METHOD,
    params,
  }).then((res) => res.data);
};

/**
 * 删除收藏记录（通过 ID）- 模仿订单 deletedById
 */
const deleteById = (id: string): Promise<ResultT<boolean>> => {
  return sendRequest<ResultT<boolean>>({
    url: `${COLLECT_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD,
  }).then((res) => res.data);
};

/**
 * 分页查询收藏记录 - 模仿订单 findPage
 */
const findByPage = (
  data: PageType<any> // 如果有特定的搜索 VO，替换 any
): Promise<ResultT<PageResult<any>>> => {
  return sendRequest<ResultT<PageResult<any>>>({
    url: `${COLLECT_PREFIX}/findByPage`,
    method: GET_METHOD, // 注意：你的 Controller 这里是 GET，如果是 POST 请改为 POST_METHOD 并把 params 放 data 里
    params: data, // 对应 Controller 的 @RequestParam
  }).then((res) => res.data);
};

export { save, findByRows, deleteById, findByPage };