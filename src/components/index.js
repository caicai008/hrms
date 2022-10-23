/**
 * 进行全局组件的挂载
 */

import PageTools from './PageTools'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
}
