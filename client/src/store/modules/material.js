const defaultMaterialState = {
  header: '',
  createDate: 0,
  saveDate: 0,
  text: '',
  creatorId: 0,
  editingId: ''
};

const state = {
  isLoading: false,
  materialData: null,

  colors: ['#D295BF', '#553555', '#DDF45B', '#35A7FF', '#F19953']
};

const getters = {
  getColour: (state) => state.colors[Math.floor(Math.random() * state.colors.length)],
  materialData: (state) => state.materialData
};

const actions = {
  async getMaterialData({ commit, dispatch, state, getters }, editingId){
    const response = await fetch(`${process.env.APP_ROOT_API}material/${editingId}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      commit('setMaterial', await response.json());
    } else {
      commit('setMaterial', null);
      console.error(response.status);
    }
  },
};

const mutations = {
  setMaterial(state, val) {
    state.materialData = val;
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
