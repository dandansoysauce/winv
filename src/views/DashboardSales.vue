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
              Charts
              <v-icon>mdi-chart-bar</v-icon>
            </v-tab>
          </v-tabs>
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
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="saleObject.dateSale"
                  label="Date"
                  readonly
                  v-on="on"
                  filled
                ></v-text-field>
              </template>
              <v-date-picker v-model="saleObject.dateSale"
                @input="dateMenu = false"></v-date-picker>
            </v-menu>
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

  searchText: string;

  searchLoading: boolean;

  selectedProduct: Product;

  dateMenu: boolean;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.readOnlyDialog = false;
    this.currentUser = {} as User;
    this.products = Array<Product>();
    this.selectedProduct = {} as Product;
    this.saleObject = {} as Sale;
    this.searchText = '';
    this.searchLoading = false;
    this.dateMenu = false;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('products', db.collection('products').where('storeId', '==', this.currentUser.storeId));
      this.saleObject = this.initSaleObject();
    } else {
      this.products = [];
    }
  }

  initSaleObject(): Sale {
    return {
      productId: '',
      quantity: 0,
      totalSale: 0,
      dateSale: '',
      name: '',
      modifiedAt: new Date(),
      createdAt: new Date(),
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
    this.saleObject.modifiedAt = new Date();

    if (this.dialogMode === 'add') {
      this.saleObject.createdAt = new Date();
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
