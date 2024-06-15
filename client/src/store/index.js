import { createStore } from 'vuex'
import auth from './modules/auth';
import user from './modules/user';
import notification from './modules/notification';
import material from './modules/material';
import socket from './modules/socket';

export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    auth,
    notification,
    material,
    socket
  },
});

export default {
  install: (app) => {
    app.use(store);
  },
};
