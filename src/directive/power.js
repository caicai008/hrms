import store from '@/store'

export default {
  inserted(el, binding) {
    const points = store.state.user.userInfo.roles.points

    // 如果 points 中有 binding.value 则显示
    // 不存在则隐藏
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
