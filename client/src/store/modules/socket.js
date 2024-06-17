import { io } from 'socket.io-client';
import _ from 'lodash';

const socketServer = `${process.env.APP_BASE_URL}`;
const clientSocketOptions = {
  path: '/socket/',
  reconnectionAttempts: 10,
  autoConnect: false
};

const state = {
  socket: io(socketServer, clientSocketOptions),
  reconnectRetriesLeft: 0
};

const actions = {
  socketConnect({ state, dispatch }) {
    dispatch('bindSocketEvents');
    state.socket.connect();
  },
  bindSocketEvents({ state, commit, rootGetters }) {
    state.socket.on('connect', () => {
      console.log('socket connected')

      state.socket.on('new-comment', (payload) => {
        console.log('new-comment', payload)
        commit('addComment', payload);
      });

      state.socket.on('change-header', (payload) => {
        console.log('change-header', payload)
        if (rootGetters.materialData.editingId === payload.editingId)
          commit('changeHeader', payload.header);
      });

      state.socket.on('add-editor', (payload) => {
        console.log('add-editor', payload)
        if (rootGetters.materialData.editingId === payload.editingId
          && !_.map(rootGetters.editors, 'userId').includes(payload.editor.userId))
          commit('addEditor', payload.editor);
      })
    });

    state.socket.on('disconnect', () => {
      console.log('socket disconnected');
    });
  },
};

const mutations = {
};

export default {
  state,
  actions,
  mutations,
};