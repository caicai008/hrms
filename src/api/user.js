import request from '@/utils/request'

/**
 * 登录接口
 * @param {*} data 用户账号密码
 * @returns promise对象
 */
export const loginAPI = (data) => request({
  url: '/sys/login',
  method: 'POST',
  data
})

/**
 * 获取用户信息
 * @returns 用户信息
 */
export const getUserProfileAPI = () => request({
  url: '/sys/profile',
  method: 'POST'
})

/**
 * 获取用户头像
 * @param {*} id 用户id
 * @returns promise
 */
export const getUserAvatarAPI = (id) => request({
  url: `/sys/user/${id}`
})
