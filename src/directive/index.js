import power from './power'

export default {
  install(Vue) {
    // 创建按钮权限控制自定义指令
    Vue.directive('power', power)
  }
}
