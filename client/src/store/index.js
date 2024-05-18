import { createStore } from 'vuex'
import auth from './modules/auth';
export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth
  }
});

export default {
  install: (app) => {
    app.use(store);
  },
};
