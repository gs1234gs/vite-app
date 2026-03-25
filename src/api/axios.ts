
import { SIGN_IN_CONST_TOKEN } from "../const/SignInConst";
import { cacheSession } from "../utils/cache";
import axios from "axios";
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
      config.headers['Authorization'] = "Bearer " + token;
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
  (response) => {
    // console.log(response)
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default sendRequest;



