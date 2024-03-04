/**
 * 封装axios实例，设置默认的请求根路径
 */

import axios from "axios";
// 导入默认的
import { BASE_URL } from "./url";
import { getToken, removeToken } from './auth'

// 创建响应的axios实例，并设置默认的请求地址
const API = axios.create({
  baseURL :BASE_URL
})

// 设置请求拦截，处理一些请求，为其加上token用以验证
API.interceptors.request.use(config => {
  const { url } = config
  if (url.startsWith('/user') && !url.startsWith('/user/login') && !url.startsWith(' /user/registered')) {
    config.headers.Authorization = getToken()
  }
  return config
})

// 设置响应拦截，如果token过期或者不合法的话，将本地的token清除
API.interceptors.response.use(response => {
  const { status } = response.data
  if (status === 400) {
    removeToken()
  }
  return response
})

export {API}