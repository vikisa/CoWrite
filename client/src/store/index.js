import { createStore } from 'vuex'
import auth from './modules/auth';
import user from './modules/user';
import notification from './modules/notification';
export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    auth,
    notification
  }
});

export default {
  install: (app) => {
    app.use(store);
  },
};
