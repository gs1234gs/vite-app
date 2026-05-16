import type { SignInType, FindCodeType, ResetPasswordType } from "../../types/SignInUpType";
import sendRequest from "../axios";
import { SYS_API_PREFIX } from "../prefix/PrefixApi";
import { POST_METHOD } from "../type/ConstRequestMethods";
const SYS_SIGN_IN_UP_PREFIX = `${SYS_API_PREFIX}/signInUp`;

const signIn = (data: SignInType) => {
  // console.log("123",data)
  return sendRequest({
    url: `${SYS_SIGN_IN_UP_PREFIX}/signIn`,
    method: POST_METHOD,
    data: data,
  }).then(res => {
    return res;
  }).catch(err => {
    throw err;
  })
}

// 获取验证码
export const findCode = (data: FindCodeType) => {
  return sendRequest({
    url: `${SYS_SIGN_IN_UP_PREFIX}/findCode`,
    method: POST_METHOD,
    data: data,
  });
};

// 忘记密码 - 重置密码（需要验证码）
export const forgotPasswordReset = (data: ResetPasswordType) => {
  return sendRequest({
    url: `${SYS_API_PREFIX}/reset/forget`,
    method: POST_METHOD,
    data: data,
  });
};

export default signIn;