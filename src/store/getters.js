const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 返回用户token
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username // 返回用户名
}
export default getters
