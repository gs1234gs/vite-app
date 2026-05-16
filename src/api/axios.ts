
import { message } from "antd";
import { SIGN_IN_CONST_TOKEN } from "../const/SignInConst";
import { cacheSession } from "../utils/cache";
import axios, { HttpStatusCode } from "axios";
import type { ResultT } from "./type/ResultType";
// const url = import.meta.env.VITE_APP_BASE_API;
// 创建axios实例 进行基本参数配置
const sendRequest = axios.create({
  // 默认请求地址，根据环境的不同可在.env 文件中进行修改
  // baseURL: import.meta.env.VITE_APP_BASE_API, // 确保有默认值
  // 设置接口访问超时时间
  timeout: 10000, // request timeout
  // 跨域时候允许携带凭证
  withCredentials: true,
  // baseURL: url,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});
sendRequest.interceptors.request.use(
  (config: any) => {
    // 从缓存中获取登录令牌
    // console.log("点击");
    const token = cacheSession.getCache(SIGN_IN_CONST_TOKEN);
    //  console.log("token",token);
   if (token) {
      // 确保 Token 是字符串并进行编码，避免非 ISO-8859-1 字符导致错误
      const encodedToken = encodeURIComponent(String(token));
      config.headers['Authorization'] = "Bearer " + encodedToken;
    } else {
      // 3. 如果没有 token，确保删除掉可能存在的旧 Header (防止污染)
      delete config.headers['Authorization'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
sendRequest.interceptors.response.use(
  (response : any) => {
    // console.log("eee",response)
  // const res : ResultT<any>  =  response.data;
  // const msg = res.msg
  // if(res.code === 401){
  //   message.warning(msg)
  //      return Promise.reject(new Error(msg || 'Error'));
  // }
  // if(res.code != HttpStatusCode.Ok){
  //   message.error(msg)
  //  return Promise.reject(new Error(msg || 'Error'));
  // }
  // message.success(msg)
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default sendRequest;



