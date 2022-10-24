/**
 * 进行全局组件的挂载
 */

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
