import { createStore } from 'vuex'
import auth from './modules/auth';
import user from './modules/user';
import notification from './modules/notification';
import material from './modules/material';

/*import {
  createWebSocketPlugin
} from '@/plugins/websocketStorePlugin';
import { socket } from '@/plugins/socket';
const websocketPlugin = createWebSocketPlugin(socket);*/
export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    auth,
    notification,
    material
  },
  //plugins: [websocketPlugin]
});

export default {
  install: (app) => {
    app.use(store);
  },
};
