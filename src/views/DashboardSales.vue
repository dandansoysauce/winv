<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Sales</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">New Sale</v-btn>
        </div>
        <div class="d-flex flex-column fill-height mt-4">
          <v-tabs v-model="currentTab" class="flex-grow-0" icons-and-text>
            <v-tab href="#overview">
              Overview
              <v-icon>mdi-home</v-icon>
            </v-tab>
            <v-tab href="#charts">
              Charts
              <v-icon>mdi-chart-bar</v-icon>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="currentTab" class="flex-grow-1">
            <v-tab-item value="overview" class="fill-height">
              <v-row class="fill-height">
                <v-col class="d-flex flex-column" cols="8" xs="12">
                  <v-row class="flex-grow-0">
                    <v-col cols="6">
                      <SalesCard :sales="sales"></SalesCard>
                    </v-col>
                    <v-col cols="6">
                      <ProfitsCard :sales="sales"></ProfitsCard>
                    </v-col>
                  </v-row>
                  <v-row class="flex-grow-1">
                    <v-col cols="12">
                      <ProductsSoldChartCard :sales="sales"></ProductsSoldChartCard>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="4" xs="12">
                  <TotalSalesCard :sales="sales"></TotalSalesCard>
                  <RecentSalesCard class="mt-4" :sales="sales"></RecentSalesCard>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item value="charts">
              <p>Charts coming soon...</p>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </div>
    <SaleDialog :dialog-mode="dialogMode" :sale-object="saleObject"
      :show-dialog.sync="showDialog" :products="products"></SaleDialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import Sale from '@/interfaces/Sale';
import Product from '@/interfaces/Product';
import User from '@/interfaces/User';
import TotalSalesCard from '@/components/TotalSalesCard.vue';
import RecentSalesCard from '@/components/RecentSalesCard.vue';
import SalesCard from '@/components/SalesCard.vue';
import ProfitsCard from '@/components/ProfitsCard.vue';
import ProductsSoldChartCard from '@/components/ProductsSoldChartCard.vue';
import SaleDialog from '@/components/dialogs/SaleDialog.vue';

@Component({
  components: {
    TotalSalesCard,
    RecentSalesCard,
    SalesCard,
    ProfitsCard,
    ProductsSoldChartCard,
    SaleDialog,
  },
})
export default class DashboardSales extends Vue {
  showDialog: boolean;

  dialogMode: string;

  products: Product[];

  currentUser: User;

  saleObject: Sale;

  searchText: string;

  searchLoading: boolean;

  selectedProduct: Product;

  currentTab: unknown;

  sales: Sale[];

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.currentUser = {} as User;
    this.products = Array<Product>();
    this.sales = Array<Sale>();
    this.selectedProduct = {} as Product;
    this.saleObject = {} as Sale;
    this.searchText = '';
    this.searchLoading = false;
    this.currentTab = null;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('products', db.collection('products')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
      this.$bind('sales', db.collection('sales')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
    } else {
      this.products = [];
      this.sales = [];
    }
  }

  initSaleObject(): Sale {
    return {
      productId: '',
      productName: '',
      productSupplierPrice: 0,
      quantity: 1,
      totalSale: 0,
      dateSale: firebase.firestore.Timestamp.fromDate(new Date()),
      name: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
      description: '',
      soldBy: this.currentUser.id ?? '',
    };
  }

  showDialogAsAdd() {
    this.saleObject = this.initSaleObject();
    this.showDialog = true;
    this.dialogMode = 'add';
  }
}
</script>
