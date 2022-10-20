import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 请求基地址，根据开发模式或者生产模式自动判断基地址
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 知识点: js文件中能否使用this.$store?
    // 不能, 因为这个this关键字不是Vue组件对象, 无法查找原型链上$store
    // 但是this.$store为了拿到的是store/index.js导出store对象
    // 解决: 我们直接把store对象导入过来使用, 是同一个store对象
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 相应拦截器
service.interceptors.response.use(
  response => {
    const { success, message } = response.data
    if (success) {
      // console.log(response)
      return response.data // 向外返回后台返回的数据
    } else {
      Message.error(message) // http 状态码2**，但是逻辑错误
      return Promise.reject(message)
    }
  },
  error => {
    Message.error(error.response.data.message) // http状态码4xx
    if (error.response.data.code === 10002) {
      // 清空用户信息
      store.commit('user/RESET_STATE')
      store.commit('user/REMOVE_TOKEN')
      router.replace('/login')
    }
    return Promise.reject(error)
  }
)

export default service
