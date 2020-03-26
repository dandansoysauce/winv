import Vue from 'vue';
import VueMaterial from 'vue-material';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase/app'
import { firestorePlugin } from 'vuefire'
import 'firebase/firestore'

export const db = firebase.initializeApp({ projectId: 'simplewonder-inventory' }).firestore()

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(firestorePlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
