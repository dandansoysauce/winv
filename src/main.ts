import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueMasonry from 'vue-masonry-css';
import firebase from 'firebase/app';
import { firestorePlugin } from 'vuefire';
import App from './App.vue';
import router from './router';
import store from './store';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

export const db = firebase.initializeApp(
  {
    projectId: process.env.VUE_APP_PROJECT_ID,
    apiKey: process.env.VUE_APP_FIREBASE_WEBAPI,
    storageBucket: process.env.VUE_APP_FIREBASE_BUCKET,
  },
).firestore();
export const storage = firebase.storage();

Vue.config.productionTip = false;

Vue.use(VueMaterial);
Vue.use(firestorePlugin);
Vue.use(VueMasonry);

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - SimpleWonder Inventory`;
  } else {
    document.title = 'SimpleWonder Inventory';
  }

  next();
});

new Vue({
  router,
  store,
  data: () => ({
    suppliers: [],
    productTypes: [],
    products: [],
  }),
  firestore() {
    return {
      suppliers: db.collection('suppliers').orderBy('enabled'),
      productTypes: db.collection('producttypes').orderBy('enabled'),
      products: db.collection('products').orderBy('enabled'),
    };
  },
  render: (h) => h(App),
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection('users').doc(user.uid).get().then((snapshot) => {
          this.$store.dispatch('setUser', snapshot.data()).then(() => {
            console.log('user set to store');
          });
        });
        if (router.currentRoute.name !== 'DashboardHome') {
          router.push({ name: 'DashboardHome' });
        }
      } else if (user === null && router.currentRoute.name !== 'Home' && router.currentRoute.name !== 'AccountCreation') {
        router.push({ name: 'Home' });
      }
    });
  },
}).$mount('#app');
