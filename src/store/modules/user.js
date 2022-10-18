const getDefaultState = () => {
  return {
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
