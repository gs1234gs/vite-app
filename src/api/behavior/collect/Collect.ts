import sendRequest from "../../axios";
import { BEHAVIOR_API_PREFIX } from "../../prefix/PrefixApi";
import { DELETE_METHOD, GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { ResultT } from "../../type/ResultType";
import type { UserCollectSaveVO, UserCollectVO } from "./CollectType";


const USER_COLLECT_PREFIX = `${BEHAVIOR_API_PREFIX}/collect`;

/**
 * 保存用户收藏记录
 */
const save = (data: UserCollectSaveVO): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${USER_COLLECT_PREFIX}/save`,
    method: POST_METHOD,
    data: data
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

/**
 * 查询用户收藏记录（可限制条数）
 */
const findByRows = (rows?: number): Promise<ResultT<UserCollectVO[]>> => {
  const params = rows !== undefined ? { rows } : {};
  return sendRequest<ResultT<UserCollectVO[]>>({
    url: `${USER_COLLECT_PREFIX}/findByRows`,
    method: GET_METHOD,
    params
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

/**
 * 删除收藏记录（通过 ID）
 */
const deleteById = (id: string): Promise<ResultT<boolean>> => {
  return sendRequest<ResultT<boolean>>({
    url: `${USER_COLLECT_PREFIX}/deleteById/${id}`,
    method: DELETE_METHOD
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

export { save, findByRows, deleteById };