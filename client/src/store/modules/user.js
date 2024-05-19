import router from '@/router';

const state = {
  userData: null,
  isAuthenticated: false
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated
};

const actions = {
  async getUserData({ commit, dispatch, state }, ){
    const response = await fetch('http://localhost:8000/api/auth/user', {
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    if (response.ok) {
      commit('updateUser', await response.json());
      commit('setAuth', true);
      console.log('state',state)
      await router.push('/');
    } else {
      console.error(response.status);
    }
  },
  async logout({ commit }) {
    await fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
    });

    commit('updateUser', null);
    commit('setAuth', false);

    await router.push('/login');
  }
};

const mutations = {
  updateUser(state, val) {
    state.userData = val;
  },
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
