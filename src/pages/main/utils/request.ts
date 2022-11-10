import axios from "axios";

export const request = axios.create({
  timeout:5000,
})
let Inc = (new Date()).getTime()
//axios 请求拦截器
axios.interceptors.request.use((config) => {
  // get请求添加一个去缓存变量
  if (config.method === 'get') {
    Inc += 1;
    if (config.params) {
      config.params._ = Inc
    } else {
      config.params = {
        _: Inc
      }
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
