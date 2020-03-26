import Vue from 'vue';
import VueMaterial from 'vue-material';
import firebase from 'firebase/app';
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import router from './router';
import store from './store';
import 'firebase/firestore';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

export const db = firebase.initializeApp(
  {
    projectId: process.env.VUE_APP_PROJECT_ID,
    apiKey: process.env.VUE_APP_FIREBASE_WEBAPI,
  },
).firestore();

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(firestorePlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
