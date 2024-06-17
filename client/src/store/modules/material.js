import _ from 'lodash';

const state = {
  isLoading: false,
  materialData: null,
  comments: {},
  editors: [],
  colors: ['#D295BF', '#553555', '#DDF45B', '#35A7FF', '#F19953'],
  openedAddComment: '',
  openedComment: '',
  authenticated: false,
  loaded: false,
  readOnly: true,
};

const getters = {
  getColour: (state) => state.colors[Math.floor(Math.random() * state.colors.length)],
  materialData: (state) => state.materialData,
  editors: (state) => state.editors,
  comments: (state) => state.comments,
  openedAddComment: (state) => state.openedAddComment,
  openedComment: (state) => state.openedComment,
  authenticated: (state) => state.authenticated,
  loaded: (state) => state.loaded,
  readOnly: (state) => state.readOnly,
};

const actions = {
  async getMaterialData({ commit }, editingId){
    const response = await fetch(`${process.env.APP_ROOT_API}material/${editingId}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      commit('setMaterial', await response.json());
    } else {
      commit('setMaterial', null);
    }
  },
  async getComments({ commit }, editingId) {
    const response = await fetch(`${process.env.APP_ROOT_API}comment/${editingId}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      const comments = await response.json();
      _.forEach(comments, comment => commit('addComment', comment))
    }
  },
  async getEditors({ commit }, editingId) {
    const response = await fetch(`${process.env.APP_ROOT_API}material/getEditors/${editingId}`, {
      headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
      const editors = await response.json();
      _.forEach(editors, editor => commit('addEditor', editor))
    }
  }
};

const mutations = {
  setMaterial(state, value) {
    state.materialData = value;
    state.loaded = true;
    console.log('materialData',state.materialData)
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  addEditor(state, editor) {
    state.editors.push({
      userId: editor.userId,
      userFullName: `${editor.user.lastname} ${editor.user.firstname}`,
      date: editor.date,
    });
  },
  addComment(state, value) {
    if (!state.comments.hasOwnProperty(value.blockId))
      state.comments[value.blockId] = [];

    state.comments[value.blockId].push(value);
  },
  setOpenedAddComment(state, value) {
    state.openedAddComment = value;
  },
  setOpenedComment(state, value) {
    state.openedComment = value;
  },
  setAuthenticated(state, value) {
    state.authenticated = value;
  },
  setLoaded(state, value) {
    state.loaded = value;
  },
  setEditorMode(state, value) {
    state.readOnly = value;
  },
  changeHeader(state, value) {
    state.materialData.header = value;
  },
  unsetMaterialData(state) {
    state.isLoading = false;
    state.materialData = null;
    state.comments = {};
    state.editors = [];
    state.openedAddComment = '';
    state.openedComment = '';
    state.authenticated = false;
    state.loaded = false;
    state.readOnly = true;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
