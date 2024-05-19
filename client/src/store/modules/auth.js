const state = {
  isAuthenticated: false
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated
};

const actions = {};

const mutations = {
  setAuth(state, val) {
    state.isAuthenticated = val;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
