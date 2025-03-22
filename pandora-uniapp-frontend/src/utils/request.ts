import axios from "axios";

// 创建 Axios 实例
// 区分开发和生产环境
const DEV_BASE_URL = "http://localhost:8101";
const PROD_BASE_URL = "http://xx.xx.xx.xx";
const myAxios = axios.create({
  baseURL: DEV_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

// 创建请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 请求执行前执行
    return config;
  },
  function (error) {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 创建响应拦截器
myAxios.interceptors.response.use(
  // 2xx 响应触发
  function (response) {
    // 处理响应数据
    const { data } = response;
    // 未登录
    if (data.code !== 0) {
      // 其他错误
      throw new Error(data.message ?? "服务器错误");
    }
    return data;
  },
  // 非 2xx 响应触发
  function (error) {
    // 处理响应错误
    return Promise.reject(error);
  },
);

export default myAxios;
