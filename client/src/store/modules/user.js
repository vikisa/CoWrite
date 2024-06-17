const state = {
  userData: null,
};

const getters = {
  userFullName: (state) => `${state.userData.firstname} ${state.userData.lastname}`,
  userData: state => state.userData
};

const actions = {
  async getUserData({ commit, dispatch, state, rootGetters }, token){
    const response = await fetch(`${process.env.APP_ROOT_API}auth/user/${token}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      commit('updateUser', await response.json());
      if (!rootGetters.editorToken)
        dispatch('getEditorToken');
    } else {
      localStorage.removeItem('user-token');
      console.error(response.status);
    }
  },
};

const mutations = {
  updateUser(state, val) {
    state.userData = val;
    console.log('state.userData',state.userData)
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
