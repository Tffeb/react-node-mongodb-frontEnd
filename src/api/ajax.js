/**
 * 发送ajax模块
 */
import axios from "axios";
import store from "../store";
axios.interceptors.request.use(
  (config) => {
    store.loadingStart();
    return config;
  },
  (error) => {
    store.loadingEnd();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    store.loadingEnd();
    return response;
  },
  (error) => {
    store.loadingEnd();
    return Promise.reject(error);
  }
);
// const baseUrl = 'http://localhost:4000'
export default function ajax(url, data = {}, type = "GET") {
  if (type === "GET") {
    // 发送GET请求
    // 拼请求参数串
    // data: {username: tom, password: 123}
    // paramStr: username=tom&password=123
    let paramStr = "?";
    Object.keys(data).forEach((key) => {
      paramStr += key + "=" + data[key] + "&";
    });
    if (paramStr) {
      paramStr = paramStr.substring(0, paramStr.length - 1);
    }
    // 使用axios发get请求
    return axios.get(url + paramStr);
  } else {
    // 发送POST请求
    // 使用axios发post请求
    return axios.post(url, data);
  }
}
