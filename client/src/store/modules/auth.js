import router from "@/router/index.js";

const state = {
  token: localStorage.getItem('user-token') || '',
  editorToken: ''
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  token: (state) => state.token,
  editorToken: (state) => state.editorToken,
};

const actions = {
  async login({ commit, dispatch, getters }, userData) {
    const response = await fetch(`${process.env.APP_ROOT_API}auth/login`, {
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
  async logout({ commit }) {
    localStorage.removeItem('user-token');
    commit('setToken', '');

    await router.push('/login');
  },
  async getEditorToken({ state, commit }) {
    const response = await fetch(`${process.env.APP_ROOT_API}auth/editor-token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({token: state.token}),
    });

    if (response.ok) {
      commit('setEditorToken', await response.text())
    }
  }
};

const mutations = {
  setToken(state, value) {
    state.token = value;
  },
  setEditorToken(state, value) {
    state.editorToken = value;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
