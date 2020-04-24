<template>
  <v-container class="d-flex flex-column full-height align-start" fluid>
    <div class="d-flex full-height flex-column width-100">
      <h1>Products</h1>
      <div class="d-flex flex-column flex-1">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">Add Product</v-btn>
        </div>
        <v-row class="flex-overflow width-100 flex-align-content">
          <v-col v-for="product in products" :key="product.id"
            cols="12" sm="6" md="4">
            <ProductCard :product-info="product"
              :dialog-mode.sync="dialogMode"
              :product-object.sync="productObject"
              :show-dialog.sync="showDialog"
              :show-restock-dialog.sync="showRestockDialog"></ProductCard>
          </v-col>
        </v-row>
      </div>
    </div>
    <RestockDialog :show-restock-dialog.sync="showRestockDialog"
      :product-object="productObject" :suppliers="suppliers"></RestockDialog>
    <ProductDialog :dialog-mode="dialogMode" :product-object="productObject"
      :show-dialog.sync="showDialog" :suppliers="suppliers"
      :product-types="productTypes"></ProductDialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import uniqid from 'uniqid';
import Product from '@/interfaces/Product';
import Supplier from '@/interfaces/Supplier';
import ProductType from '@/interfaces/ProductType';
import User from '@/interfaces/User';
import Restock from '@/interfaces/Restock';
import ProductDialog from '@/components/dialogs/ProductDialog.vue';
import RestockDialog from '@/components/dialogs/RestockDialog.vue';
import ProductCard from '@/components/cards/ProductCard.vue';

@Component({
  components: {
    ProductDialog,
    RestockDialog,
    ProductCard,
  },
})
export default class DashboardProducts extends Vue {
  showDialog: boolean;

  showRestockDialog: boolean;

  dialogMode: string;

  suppliers: Supplier[];

  productTypes: ProductType[];

  productObject: Product;

  products: Product[];

  currentUser: User;

  restockObject: Restock;

  constructor() {
    super();
    this.showDialog = false;
    this.showRestockDialog = false;
    this.dialogMode = '';
    this.productTypes = Array<ProductType>();
    this.suppliers = Array<Supplier>();
    this.products = Array<Product>();
    this.productObject = {} as Product;
    this.restockObject = {} as Restock;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('productTypes', db.collection('producttypes')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
      this.$bind('suppliers', db.collection('suppliers')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
      this.$bind('products', db.collection('products')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
    } else {
      this.productTypes = [];
      this.suppliers = [];
      this.products = [];
    }
  }

  showDialogAsAdd(): void {
    this.productObject = this.initProductObject();
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  initProductObject(): Product {
    return {
      productCode: uniqid(),
      pricePerItem: 0,
      salePrice: 0,
      suppliedBy: '',
      quantity: 1,
      productTypeId: '',
      name: '',
      description: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      properties: [],
      storeId: this.currentUser.storeId,
      salePricePercentage: 0,
      manuallySetPrice: true,
    };
  }
}
</script>
