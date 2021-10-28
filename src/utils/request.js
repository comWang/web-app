import axios from 'axios'
import storage from 'store'
import store from '@/store'
import { Message } from 'element-ui'
import { ACCESS_TOKEN } from '@/config/types'
import { elegantPromise, throttle, filterEmptyProps } from './common'

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 1000 * 30,
  withCredentials: true,
})
const errorNotify = throttle(Message.error, Message, 3 * 1000, true)

instance.interceptors.request.use(
  function(config) {
    config.headers['Access-Token'] = storage.get(ACCESS_TOKEN)
    config.params = filterEmptyProps(config.params)
    config.data = filterEmptyProps(config.data)

    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  function(response) {
    if (!response.data || !response.data.flag) {
      const err = new Error(`${(response.data && response.data.message) || '错误的响应'}`)

      errorNotify({
        message: err.message,
      })

      return Promise.reject(err)
    }

    // 对响应数据做点什么
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    if (!error.response) {
      errorNotify({
        message: '服务不可达，可能是网络连接出现了问题',
      })
    } else if (error.response.status === 401) {
      store.dispatch('logout')
    } else if (error.response.status >= 500) {
      errorNotify({
        message: '服务器开小差了，请稍后再试~',
      })
    }

    return Promise.reject(error)
  }
)

export default function request(...rest) {
  return elegantPromise(instance(...rest))
}
