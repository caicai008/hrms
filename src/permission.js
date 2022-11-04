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
        const menus = await store.dispatch('user/getUserInfo')
        // 根据用户实际的权限 menus 从asyncRouteArr里, 过滤出用户能访问的页面的路由对象
        const filterRoutes = asyncRouters.filter(route => {
          const routeName = route.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })

        router.addRoutes(filterRoutes)

        // 404页必须设置在最后！--- 解决刷新白屏问题
        filterRoutes.push(
          { path: '*', redirect: '/404', hidden: true }
        )

        // 将动态路由传递给 mutation 方法，进行合并
        store.commit('permission/setRoutes', filterRoutes)

        // 解决刷新出现白屏的bug
        next({
          path: to.path, // 保证路由添加完了再重新进入
          replace: true // 重进一次，不保留重复历史
        })
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
