import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserProfileAPI, getUserAvatarAPI } from '@/api/user'

const getDefaultState = () => {
  return {
    token: getToken(), // 获取用户token，默认 ''
    userInfo: {} // 用户信息
  }
}
const state = getDefaultState()

const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 设置token
  SET_TOKEN(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  // 删除token
  REMOVE_TOKEN(state, newToken) {
    state.token = ''
    removeToken()
  },
  // 设置用户信息
  SET_USER(state, userObj) {
    state.userInfo = userObj
  }
}

const actions = {
  // 获取用户信息
  async getUserInfo({ commit }) {
    // 用结构赋值, 把data的值保存到左边变量
    const { data: userObj } = await getUserProfileAPI() // 用户基本信息
    const { data: avatarObj } = await getUserAvatarAPI(userObj.userId) // 用户头像
    // console.log(userObj)
    const newObj = { ...userObj, ...avatarObj } // 合并用户信息
    commit('SET_USER', newObj)
  },
  // 退出登录
  async logoutActions({ commit }) {
    commit('REMOVE_TOKEN')
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
