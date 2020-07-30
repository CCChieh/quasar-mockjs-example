import axios from 'axios'
import store from '@/store'
import { Notify } from 'quasar'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters['user/token']) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = 'Bearer ' + store.getters['user/token']
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
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log('66', res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.respCode !== '20000') {
      Notify.create({
        message: res.respMsg || 'Error',
        color: 'negative',
        icon: 'highlight_off'
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.respCode === '50008' || res.respCode === '50012' || res.respCode === '50014') {
        // to re-login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
      }
      return Promise.reject(new Error(res.respMsg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const status = error.response.status
    if (status === 401) {
      // to re-login
      // MessageBox.confirm('身份信息失效，请退出或重新登录', '信息失效', {
      //   confirmButtonText: '重新登录',
      //   type: 'warning'
      // }).then(() => {
      //   store.dispatch('user/resetToken').then(() => {
      //     location.reload()
      //   })
      // })
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    Notify.create({
      message: error.message,
      color: 'negative',
      icon: 'highlight_off'
    })
    return Promise.reject(error)
  }
)

export default service
