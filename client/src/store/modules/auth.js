import router from "@/router/index.js";

const state = {
  token: localStorage.getItem('user-token') || ''
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
};

const actions = {
  async login({ commit, dispatch, state, getters }, userData) {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem('user-token', token);
      commit('setToken', token);
      dispatch('getUserData', token);
      await router.push({ name: 'home' });
    }
    else {
      localStorage.removeItem('user-token');
      commit('setToken', '');
      getters.showNotification('Что-то пошло не так', 'error');
    }
  },
  async logout({ state, commit }) {
    localStorage.removeItem('user-token');
    commit('setToken', '');

    await router.push('/login');
  }
};

const mutations = {
  setToken(state, val) {
    state.token = val;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
