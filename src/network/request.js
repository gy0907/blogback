import axios from 'axios'

// 导入进度条插件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// https://www.liulongbin.top:8888/api/private/v1

export default function request(options) {
  const instance = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
    method: options.method || 'get'
  })
  instance.interceptors.request.use(options=>{
    options.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    return options
  },err=>{
  })
  instance.interceptors.response.use(res=>{
    NProgress.done()
    return res.data
  },err=>{
  })
  return instance(options)
}