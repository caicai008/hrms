/**
 * 进行全局组件的挂载
 */

import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImg from './UploadImg'
import ImageHolder from './ImageHolder'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
  }
}
