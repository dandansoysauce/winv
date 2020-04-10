<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Sales</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">New Sale</v-btn>
        </div>
        <div class="fill-height mt-4">
          <v-tabs fixed-tabs icons-and-text>
            <v-tab>
              Overview
              <v-icon>mdi-home</v-icon>
            </v-tab>
            <v-tab>
              Tabular Report
              <v-icon>mdi-table</v-icon>
            </v-tab>
          </v-tabs>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import Sale from '@/interfaces/Sale';
import Product from '@/interfaces/Product';
import User from '@/interfaces/User';

@Component
export default class DashboardSales extends Vue {
  showDialog: boolean;

  dialogMode: string;

  readOnlyDialog: boolean;

  products: Product[];

  currentUser: User;

  saleObject: Sale;

  selectedLabel: string;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.readOnlyDialog = false;
    this.currentUser = {} as User;
    this.products = Array<Product>();
    this.saleObject = {} as Sale;
    this.selectedLabel = '';
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.saleObject = this.initSaleObject();
    if (this.currentUser) {
      this.$bind('products', db.collection('products').where('storeId', '==', this.currentUser.storeId));
      setTimeout(() => {
        console.log(this.products);
      }, 1000);
    } else {
      this.products = [];
    }
  }

  get sanitizedProducts() {
    return this.products.map((label) => ({
      Id: label.id,
      Name: label.name,
      toLowerCase: () => label.name.toLowerCase(),
      toString: () => label.name,
    }));
  }

  initSaleObject(): Sale {
    return {
      productId: '',
      quantity: 0,
      grandTotal: 0,
      dateSale: new Date(),
      name: '',
      modifiedAt: new Date(),
      createdAt: new Date(),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
      description: '',
    };
  }

  showDialogAsAdd() {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'add';
  }
}
</script>
