const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 返回用户token
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username, // 返回用户名
  companyId: state => state.user.userInfo.companyId, // 公司id
  userId: state => state.user.userInfo.userId // 用户id
}
export default getters
