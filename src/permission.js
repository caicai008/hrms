// 导入进度条插件
import NProgress from 'nprogress'
// 导入进度条样式
import 'nprogress/nprogress.css'
import router, { asyncRouters } from './router'
import store from './store'
import getPageTitle from './utils/get-page-title'

const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 获取到token
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      // 有token，用户已经登录了，就不能再跳转到登录页了
      next('/')
      NProgress.done()
    } else {
      // 如果token存在，但是访问的是其他页面，直接放行
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
        router.addRoutes(asyncRouters)

        // 将动态路由传递给 mutation 方法，进行合并
        store.commit('permission/setRoutes', asyncRouters)
      }
      next()
      if (!store.getters.name) {
        store.dispatch('user/getUserInfo')
      }
    }
  } else {
    // 没有token，但是访问的是白名单页面，放行
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 没有token，但不是白名单页面，跳转到登录页
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // 获取当前标题
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})
