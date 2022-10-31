/**
 * Vuex 权限，动态路由模块
 */
import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: () => ({
    routes: constantRoutes
  }),
  mutations: {
    setRoutes(state, asyncRouters) {
      // 将动态路由和静态路由组合起来
      state.routes = [...constantRoutes, ...asyncRouters]
    }
  }
}
