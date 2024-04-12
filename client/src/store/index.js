import { createStore } from 'vuex'

export const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});

export default {
  install: (app) => {
    app.use(store);
  },
};
