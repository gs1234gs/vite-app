import sendRequest from "../../axios";
import { BEHAVIOR_API_PREFIX } from "../../prefix/PrefixApi";
import { GET_METHOD, POST_METHOD } from "../../type/ConstRequestMethods";
import type { ResultT } from "../../type/ResultType";
import type { UserClickSaveVO, UserClickVO } from "./ClickType";


const USER_CLICK_PREFIX = `${BEHAVIOR_API_PREFIX}/click`; // 注意：Java 中未写 @RequestMapping，但按惯例应有路径

/**
 * 保存用户点击记录
 */
const save = (data: UserClickSaveVO): Promise<ResultT<string>> => {
  return sendRequest<ResultT<string>>({
    url: `${USER_CLICK_PREFIX}/save`,
    method: POST_METHOD,
    data: data
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

/**
 * 查询用户点击记录（可限制条数）
 */
const findByRows = (rows?: number): Promise<ResultT<UserClickVO[]>> => {
  const params = rows !== undefined ? { rows } : {};
  return sendRequest<ResultT<UserClickVO[]>>({
    url: `${USER_CLICK_PREFIX}/findByRows`,
    method: GET_METHOD,
    params
  })
    .then(res => res.data)
    .catch(err => { throw err; });
};

export { save, findByRows };