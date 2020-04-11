<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Products</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">Add Product</v-btn>
        </div>
        <div class="fill-height mt-4">
          <v-row>
            <v-col v-for="product in products" :key="product.id"
              cols="12" sm="4">
              <v-card class="mx-auto" raised>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline">{{ product.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ product.description.length > 0 ? product.description
                        : 'No Description' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-row align="center">
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-package-variant-closed</v-icon>
                      </v-list-item-icon>
                      <v-list-item-subtitle>{{ product.quantity }} pcs</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                  <v-col cols="6">
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>mdi-cash</v-icon>
                      </v-list-item-icon>
                      <v-list-item-subtitle>{{ product.salePrice }} ea.</v-list-item-subtitle>
                    </v-list-item>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-btn text>
                    View
                  </v-btn>
                  <v-btn depressed @click="editProduct(product)">
                    Edit
                  </v-btn>
                  <v-btn color="primary" depressed>
                    Restock
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          Product
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <form novalidate>
            <v-text-field label="Name" filled v-model="productObject.name"></v-text-field>
            <v-textarea label="Description" filled
              v-model="productObject.description"></v-textarea>
            <v-select :items="productTypes" v-model="productObject.productTypeId"
              item-text="name" item-value="id" filled
              label="Category" @input="productTypeChange()"
            ></v-select>
            <v-text-field label="Sale Price" filled
              v-model="productObject.salePrice" type="number"></v-text-field>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Product Code" filled
                  append-icon="mdi-text-box-plus-outline"
                  @click:append="generateRandomCode()"
                  v-model="productObject.productCode"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-select :items="suppliers" v-model="productObject.suppliedBy"
                    item-text="name" item-value="id" filled
                    label="Supplied By" @input="productTypeChange()"
                  ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Price Per Item" filled
                  v-model="productObject.pricePerItem" type="number"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                 <v-text-field label="Quantity" filled
                  v-model="productObject.quantity" type="number"></v-text-field>
              </v-col>
            </v-row>
            <div class="d-flex">
              <h4>Custom Properties</h4>
            </div>
            <v-row v-for="pr in productObject.properties" :key="pr.id">
              <v-col cols="12">
                <v-text-field :label="pr.name" filled v-model="pr.value" type="text"
                  v-if="pr.propertyType === 'Text'"></v-text-field>
                <v-text-field :label="pr.name" filled v-model="pr.value" type="number"
                  v-if="pr.propertyType === 'Number'"></v-text-field>
                <v-menu
                  v-model="pr.menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  v-if="pr.propertyType === 'Date'"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="pr.value"
                      :label="pr.name"
                      readonly
                      v-on="on"
                      filled
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="pr.value" @input="pr.menu = false"></v-date-picker>
                </v-menu>
                <v-menu
                  v-model="pr.menu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                  v-if="pr.propertyType === 'Time'"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="pr.value"
                      :label="pr.name"
                      readonly
                      v-on="on"
                      filled
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="pr.value" @input="pr.menu = false"></v-time-picker>
                </v-menu>
                <v-checkbox v-model="pr.value" :label="pr.name"
                  v-if="pr.propertyType === 'Checkbox'"></v-checkbox>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions class="card-action-padding">
          <v-btn text @click="closeDialog()">Close</v-btn>
          <v-btn color="primary" depressed width="120" @click="saveProduct()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import uniqid from 'uniqid';
import Product from '@/interfaces/Product';
import Supplier from '@/interfaces/Supplier';
import ProductType from '@/interfaces/ProductType';
import ProductPropertyType from '@/interfaces/ProductPropertyType';
import User from '@/interfaces/User';

@Component
export default class DashboardProducts extends Vue {
  showDialog: boolean;

  dialogMode: string;

  suppliers: Supplier[];

  productTypes: ProductType[];

  productObject: Product;

  productObjectCustomProperties: ProductPropertyType[];

  products: Product[];

  currentUser: User;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.productObjectCustomProperties = [];
    this.productTypes = Array<ProductType>();
    this.suppliers = Array<Supplier>();
    this.products = Array<Product>();
    this.productObject = {} as Product;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('productTypes', db.collection('producttypes').where('storeId', '==', this.currentUser.storeId));
      this.$bind('suppliers', db.collection('suppliers').where('storeId', '==', this.currentUser.storeId));
      this.$bind('products', db.collection('products').where('storeId', '==', this.currentUser.storeId));

      this.productObject = this.initProductObject();
    } else {
      this.productTypes = [];
      this.suppliers = [];
      this.products = [];
    }
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMode = '';
    this.productObject = this.initProductObject();
  }

  enableDisable(product: Product): void {
    const state = product.enabled;
    db.collection('products').doc(product.id).update({ enabled: state, modifiedAt: new Date() });
  }

  editProduct(product: Product): void {
    this.showDialog = true;
    this.dialogMode = 'edit';
    this.productObject = product;
  }

  viewProduct(product: Product): void {
    this.showDialog = true;
    this.productObject = product;
  }

  saveProduct(): void {
    this.showDialog = false;
    this.productObject.modifiedAt = new Date();

    if (this.dialogMode === 'add') {
      this.productObject.createdAt = new Date();
      db.collection('products').add(this.productObject).then(() => {
        this.productObject = this.initProductObject();
      });
    } else if (this.dialogMode === 'edit') {
      db.collection('products').doc(this.productObject.id).set(this.productObject).then(() => {
        this.productObject = this.initProductObject();
      });
    }
  }

  productTypeChange(): void {
    const getProductType = this.productTypes.filter((x) => x.id
      === this.productObject.productTypeId)[0];
    if (getProductType) {
      this.productObject.properties = getProductType.properties;
    } else {
      this.productObject.properties = [];
    }
  }

  generateRandomCode(): void {
    this.productObject.productCode = uniqid();
  }

  initProductObject(): Product {
    return {
      productCode: '',
      pricePerItem: 0,
      salePrice: 0,
      suppliedBy: '',
      quantity: 0,
      productTypeId: 'EvaKvKXKJCUr8TFyBFxc',
      name: '',
      description: '',
      modifiedAt: new Date(),
      createdAt: new Date(),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      properties: [],
      storeId: this.currentUser.storeId,
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
}
</style>
