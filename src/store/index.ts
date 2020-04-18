import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    settings: null,
  },
  mutations: {
    setUser(state, currentUser) {
      state.currentUser = currentUser;
    },
    saveSettings(state, settings) {
      state.settings = settings;
    },
  },
  actions: {
    setUser(context, currentUser) {
      context.commit('setUser', currentUser);
    },
    saveSettings(context, settings) {
      context.commit('saveSettings', settings);
    },
  },
  modules: {
  },
});
