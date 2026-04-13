import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { GET_METHOD } from "../type/ConstRequestMethods";

const SYS_LOGOUT_PREFIX = `${SYS_API_PREFIX}/logout`;

const logout = () => {
  // console.log("123",data)
  return sendRequest({
    url: SYS_LOGOUT_PREFIX,
    method: GET_METHOD,
  }).then(res => {
    return res;
  }).catch(err => {
    throw err;
  })
}


export default logout;