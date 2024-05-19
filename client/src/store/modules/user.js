import router from '@/router';

const state = {
  userData: null,
};

const getters = {
};

const actions = {
  async getUserData({ commit, dispatch, state, getters }, token){
    const response = await fetch(`http://localhost:8000/api/auth/user`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      commit('updateUser', await response.json());
      await router.push('/');
    } else {
      localStorage.removeItem('user-token');
      console.error(response.status);
    }
  },
};

const mutations = {
  updateUser(state, val) {
    state.userData = val;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
