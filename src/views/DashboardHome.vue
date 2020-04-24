<template>
  <v-container class="d-flex flex-column full-height align-start" fluid>
    <div class="d-flex full-height flex-column width-100">
      <h1>Dashboard</h1>
      <div class="d-flex flex-column flex-1">
        <v-row class="full-height">
          <v-col cols="6" xs="12" class="full-height d-flex flex-column">
            <NumberProductsCard :products="products"></NumberProductsCard>
            <RestockAlerts class="mt-4" :products="products"></RestockAlerts>
          </v-col>
          <v-col cols="6" xs="12" class="full-height d-flex flex-column">
            <SalesCard :sales="sales"></SalesCard>
            <ProfitsCard class="mt-4" :sales="sales"></ProfitsCard>
            <TotalSalesCard class="mt-4" :sales="sales"></TotalSalesCard>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { db } from '@/main';
import Product from '@/interfaces/Product';
import Sale from '@/interfaces/Sale';
import User from '@/interfaces/User';
import RestockAlerts from '@/components/RestockAlerts.vue';
import NumberProductsCard from '@/components/cards/NumberProductsCard.vue';
import SalesCard from '@/components/cards/SalesCard.vue';
import ProfitsCard from '@/components/cards/ProfitsCard.vue';
import TotalSalesCard from '@/components/cards/TotalSalesCard.vue';

@Component({
  components: {
    RestockAlerts,
    NumberProductsCard,
    SalesCard,
    ProfitsCard,
    TotalSalesCard,
  },
})
export default class DashboardHome extends Vue {
  products: Product[];

  sales: Sale[];

  currentUser: User;

  constructor() {
    super();
    this.products = [];
    this.sales = [];
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.bindFirestore(this.currentUser);
    }
  }

  bindFirestore(user: User) {
    this.$bind('products', db.collection('products')
      .where('storeId', '==', user.storeId)
      .orderBy('name'));
  }

  get userStore() {
    return this.$store.state.currentUser;
  }

  @Watch('userStore')
  onUserStoreChanged(value: User) {
    this.bindFirestore(value);
  }
}
</script>
