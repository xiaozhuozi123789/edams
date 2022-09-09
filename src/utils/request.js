import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

const toLogin = () => {
  MessageBox.confirm('令牌过期，请重新登录', '重新登录', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.dispatch('user/resetToken').then(() => {
      location.reload()
    })
  })
}

/*
  请求失败后的错误统一处理
  status 请求失败的状态码
*/
const errorHandler = (status, other) => {
  let message = ''
  // 状态码判断
  switch (status) {
    case 302:
      message = '接口重定向了！'
      break
    case 400:
      message = '参数不正确！'
      break
    // 401: 未登录状态，跳转登录页
    case 401:
      message = '您未登录，或者登录已经超时，请先登录！'
      toLogin()
      break
    // 403: token过期
    // 清除token并跳转登录页
    case 403:
      message = '认证已过期, 请重新登录'
      // 此处token失效则重新进行授权
      // tip('登录过期，请重新登陆')
      removeToken()
      // store.commit('loginSuccess', null)
      setTimeout(() => {
        toLogin()
      }, 1000)
      break
    // 404: 请求不存在
    case 404:
      message = '请求的资源不存在'
      break
    case 408: message = '请求超时！'; break
    case 409: message = '系统已存在相同数据！'; break
    case 500:
      message = '服务器内部错误！'
      break
    case 501: message = '服务未实现！'; break
    case 502: message = '网关错误！'; break
    case 503: message = '服务不可用！'; break
    case 504: message = '服务暂时无法访问，请稍后再试！'; break
    case 505: message = 'HTTP版本不受支持!'; break
    default:
      message = '异常问题，请联系管理员！'
      console.log(other, 'request error and params is other')
  }
  Message({
    message,
    type: 'error',
    duration: 5 * 1000
  })
}

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  res => {
    if (res.status >= 200 && res.status < 300) {
      if (res.headers['content-type'] === 'application/octet-stream') {
        return res
      }
      if (res.data.code !== 0) {
        Message({
          message: res.data.msg || 'Error',
          type: 'error'
        })
        return Promise.reject(res)
      }
      return Promise.resolve(res.data)
    } else {
      errorHandler(res, res.data.message)
      return Promise.reject(res)
    }
  },
  error => {
    console.log(error.response) // for debug
    errorHandler(error.response.status, error.response.data.message)
    return Promise.reject(error.response)
  }
)

export default service
