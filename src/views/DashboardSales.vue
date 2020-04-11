<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Sales</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">New Sale</v-btn>
        </div>
        <div class="d-flex flex-column fill-height mt-4">
          <v-tabs v-model="currentTab" class="flex-grow-0" fixed-tabs icons-and-text>
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
                <v-col cols="8" xs="12"></v-col>
                <v-col cols="4" xs="12">
                  <TotalSalesCard :sales="sales"></TotalSalesCard>
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
    <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          Sale
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <form novalidate>
            <v-autocomplete :items="products"
              v-model="saleObject.productId"
              :loading="searchLoading"
              :search-input.sync="searchText"
              hide-no-data
              hide-selected item-text="name"
              item-value="id"
              label="Product"
              prepend-icon="mdi-database-search"
              filled
              @input="productSelected()"></v-autocomplete>
            <v-text-field label="Quantity" filled v-model="saleObject.quantity"
              @input="calculateSale()"></v-text-field>
            <v-text-field label="Total Sale" filled v-model="saleObject.totalSale"
              readonly></v-text-field>
            <v-textarea label="Notes" filled v-model="saleObject.description"></v-textarea>
          </form>
        </v-card-text>
        <v-card-actions class="card-action-padding">
          <v-btn text @click="closeDialog()">Close</v-btn>
          <v-btn color="primary" depressed width="120" @click="saveSale()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { format } from 'date-fns';
import { db } from '@/main';
import Sale from '@/interfaces/Sale';
import Product from '@/interfaces/Product';
import User from '@/interfaces/User';
import TotalSalesCard from '@/components/TotalSalesCard.vue';

@Component({
  components: {
    TotalSalesCard,
  },
})
export default class DashboardSales extends Vue {
  showDialog: boolean;

  dialogMode: string;

  readOnlyDialog: boolean;

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
    this.readOnlyDialog = false;
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
      this.$bind('products', db.collection('products').where('storeId', '==', this.currentUser.storeId));
      this.$bind('sales', db.collection('sales').where('storeId', '==', this.currentUser.storeId));
      this.saleObject = this.initSaleObject();
    } else {
      this.products = [];
      this.sales = [];
    }
  }

  initSaleObject(): Sale {
    return {
      productId: '',
      quantity: 0,
      totalSale: 0,
      dateSale: '',
      name: '',
      modifiedAt: format(new Date(), 'dd-mm-yyyy kk:mm:ss xxxx'),
      createdAt: format(new Date(), 'dd-mm-yyyy kk:mm:ss xxxx'),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
      description: '',
      soldBy: this.currentUser.id ?? '',
    };
  }

  productSelected() {
    if (this.saleObject.productId.length > 0) {
      [this.selectedProduct] = this.products.filter((x) => x.id === this.saleObject.productId);
    }
  }

  calculateSale() {
    if (this.saleObject.quantity && this.selectedProduct.id) {
      this.saleObject.totalSale = this.saleObject.quantity * this.selectedProduct.salePrice;
    }
  }

  saveSale() {
    this.showDialog = false;
    this.saleObject.modifiedAt = format(new Date(), 'dd-mm-yyyy kk:mm:ss xxxx');

    if (this.dialogMode === 'add') {
      this.saleObject.createdAt = format(new Date(), 'dd-mm-yyyy kk:mm:ss xxxx');
      this.saleObject.dateSale = format(new Date(), 'dd-mm-yyyy kk:mm:ss xxxx');
      db.collection('sales').add(this.saleObject).then(() => {
        db.collection('products').doc(this.saleObject.productId).get().then((snap) => {
          const getProduct = snap.data() as Product;
          const newQuantity = getProduct.quantity - this.saleObject.quantity;
          db.collection('products').doc(this.saleObject.productId).update({ quantity: newQuantity }).then(() => {
            this.saleObject = this.initSaleObject();
          });
        });
      });
    } else if (this.dialogMode === 'edit') {
      db.collection('sales').doc(this.saleObject.id).set(this.saleObject).then(() => {
        this.saleObject = this.initSaleObject();
      });
    }
  }

  showDialogAsAdd() {
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  editProduct(sale: Sale): void {
    this.showDialog = true;
    this.dialogMode = 'edit';
    this.saleObject = sale;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMode = '';
    this.saleObject = this.initSaleObject();
  }
}
</script>

<style lang="scss" scoped>
// .tabs-container >>> .v-window__container {
//   width: 100%;
// }
</style>
