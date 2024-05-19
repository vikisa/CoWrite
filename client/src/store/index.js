import { createStore } from 'vuex'
//import auth from './modules/auth';
import user from './modules/user';
export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user
  }
});

export default {
  install: (app) => {
    app.use(store);
  },
};
