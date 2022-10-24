import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

// 动态路由规则
export const asyncRouters = [
  // 审批
  {
    path: '/approvals',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Approvals',
        component: () => import('@/views/approvals'),
        meta: { title: '审批', icon: 'tree-table' }
      }
    ]
  },
  // 考勤
  {
    path: '/attendances',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Attendances',
        component: () => import('@/views/attendances'),
        meta: { title: '考勤', icon: 'skill' }
      }
    ]
  },
  // 组织结构
  {
    path: '/departments',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Departments',
        component: () => import('@/views/departments'),
        meta: { title: '组织结构', icon: 'tree' }
      }
    ]
  },
  // 员工
  {
    path: '/employees',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Employees',
        component: () => import('@/views/employees'),
        meta: { title: '员工', icon: 'people' }
      },
      {
        path: 'detail',
        name: 'employeesDetail',
        component: () => import('@/views/employees/detail.vue'),
        hidden: true
      }
    ]
  },
  // 权限
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Permission',
        component: () => import('@/views/permission'),
        meta: { title: '权限', icon: 'lock' }
      }
    ]
  },
  // 薪资
  {
    path: '/salarys',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Salarys',
        component: () => import('@/views/salarys'),
        meta: { title: '薪资', icon: 'money' }
      }
    ]
  },
  // 角色设置
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Setting',
        component: () => import('@/views/setting'),
        meta: { title: '角色设置', icon: 'setting' }
      }
    ]
  },
  // 社保
  {
    path: '/social',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Social',
        component: () => import('@/views/social'),
        meta: { title: '社保', icon: 'table' }
      }
    ]
  }
]

// 静态路由表
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  // excel
  {
    path: '/excel',
    component: Layout,
    hidden: true, // 不显示到左侧菜单
    children: [
      {
        path: '',
        component: () => import('@/views/excel')
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRouters]
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
