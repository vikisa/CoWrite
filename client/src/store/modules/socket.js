import { io } from 'socket.io-client';

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
  socketConnect({ state, commit, dispatch }) {
    dispatch('bindSocketEvents');
    state.socket.connect();
  },
  bindSocketEvents({ state, commit, dispatch, rootGetters }) {
    state.socket.on('connect', () => {
      console.log('socket connected')

      state.socket.on('new-comment', (payload) => {
        console.log('new-comment', payload)
        commit('addComment', payload);
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