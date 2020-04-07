import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
  },
  mutations: {
    setUser(state, currentUser) {
      state.currentUser = currentUser;
    },
  },
  actions: {
    setUser(context, currentUser) {
      context.commit('setUser', currentUser);
    },
  },
  modules: {
  },
});
