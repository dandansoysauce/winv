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
    <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          Sale
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <ValidationObserver ref="observer">
            <form novalidate>
              <ValidationProvider v-slot="{ errors }" name="Product" rules="required">
                <v-autocomplete :items="products"
                  v-model="saleObject.productId"
                  :error-messages="errors"
                  :loading="searchLoading"
                  :search-input.sync="searchText"
                  hide-no-data
                  hide-selected item-text="name"
                  item-value="id"
                  label="Product"
                  prepend-icon="mdi-database-search"
                  filled
                  @input="productSelected()"
                  required></v-autocomplete>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Quantity"
                rules="required|min_value:1">
                <v-text-field label="Quantity" filled v-model="saleObject.quantity"
                  @input="calculateSale()" type="number" min="1"
                  @focus="$event.target.select()" required
                  :error-messages="errors"></v-text-field>
              </ValidationProvider>
              <v-currency-field label="Total Sale" filled v-model="saleObject.totalSale"
                readonly></v-currency-field>
              <v-textarea label="Notes" filled v-model="saleObject.description"></v-textarea>
            </form>
          </ValidationObserver>
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
// eslint-disable-next-line @typescript-eslint/camelcase
import { required, min_value } from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');
extend('required', {
  ...required,
  message: '{_field_} is required',
});
extend('min_value', {
  // eslint-disable-next-line @typescript-eslint/camelcase
  ...min_value,
  message: '{_field_} should be at least {min}',
});


@Component({
  components: {
    TotalSalesCard,
    RecentSalesCard,
    SalesCard,
    ProfitsCard,
    ProductsSoldChartCard,
    ValidationObserver,
    ValidationProvider,
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
      this.$bind('products', db.collection('products')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
      this.$bind('sales', db.collection('sales')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
      this.saleObject = this.initSaleObject();
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

  productSelected() {
    if (this.saleObject.productId.length > 0) {
      [this.selectedProduct] = this.products.filter((x) => x.id === this.saleObject.productId);
      this.saleObject.productName = this.selectedProduct.name;
      this.saleObject.productSupplierPrice = this.selectedProduct.pricePerItem;
      this.calculateSale();
    }
  }

  calculateSale() {
    if (this.saleObject.quantity && this.selectedProduct.id) {
      this.saleObject.totalSale = this.saleObject.quantity * this.selectedProduct.salePrice;
    }
  }

  saveSale() {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.showDialog = false;
        this.saleObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.saleObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          this.saleObject.dateSale = firebase.firestore.Timestamp.fromDate(new Date());
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
      });
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
