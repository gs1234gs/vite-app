import sendRequest from "../../axios";
import { BEHAVIOR_API_PREFIX } from "../../prefix/PrefixApi";
import { GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { ResultT } from "../../type/ResultType";
import type { UserBrowseSaveVO, UserBrowseVO } from "./BrowseType";


const USER_BROWSE_PREFIX = `${BEHAVIOR_API_PREFIX}/browse`;

/**
 * 批量保存用户浏览记录
 */
const save = (data: UserBrowseSaveVO[]): Promise<ResultT<string[]>> => {
  return sendRequest<ResultT<string[]>>({
    url: `${USER_BROWSE_PREFIX}/save`,
    method: POST_METHOD,
    data: data
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

/**
 * 查询用户浏览记录（可限制条数）
 */
const findByRows = (rows?: number): Promise<ResultT<UserBrowseVO[]>> => {
  const params = rows !== undefined ? { rows } : {};
  return sendRequest<ResultT<UserBrowseVO[]>>({
    url: `${USER_BROWSE_PREFIX}/findByRows`,
    method: GET_METHOD,
    params
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

export { save, findByRows };