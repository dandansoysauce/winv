<template>
  <v-container class="full-height align-start">
    <div class="d-flex full-height flex-column width-100">
      <h1>Dashboard</h1>
      <div class="d-flex full-height flex-column">
        <v-row class="with-button-container">
          <v-col cols="6" xs="12">
            <RestockAlerts :products="products"></RestockAlerts>
          </v-col>
          <v-col cols="6" xs="12"></v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import RestockAlerts from '@/components/RestockAlerts.vue';
import Product from '@/interfaces/Product';
import User from '@/interfaces/User';

@Component({
  components: {
    RestockAlerts,
  },
})
export default class DashboardHome extends Vue {
  products: Product[];

  currentUser: User;

  constructor() {
    super();
    this.products = [];
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('products', db.collection('products')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
    }
  }
}
</script>
