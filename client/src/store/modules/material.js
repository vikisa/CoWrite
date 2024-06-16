import _ from 'lodash';
import * as Y from "yjs";

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
  comments: {},
  editors: [],
  colors: ['#D295BF', '#553555', '#DDF45B', '#35A7FF', '#F19953'],
  openedAddComment: '',
  openedComment: '',
  authenticated: false,
  loaded: false,
  docStore: new Y.Doc()
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
  docStore: (state) => state.docStore
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
  async getComments({ commit }, editingId) {
    const response = await fetch(`${process.env.APP_ROOT_API}comment/${editingId}`, {
      headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
      const comments = await response.json();
      _.forEach(comments, comment => commit('addComment', comment))
    } else {
      console.error('getComments');
    }
  }
};

const mutations = {
  setMaterial(state, val) {
    state.materialData = val;
  },
  setIsLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setEditors(state, value) {
    state.editors = value;
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};
