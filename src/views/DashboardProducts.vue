<template>
  <div class="container flex flex-column">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Product</md-dialog-title>
      <md-dialog-content class="md-scrollbar">
        <form novalidate class="md-layout">
          <div class="md-layout">
            <md-field>
              <label>Name</label>
              <md-input v-model="productObject.name" :readonly="readOnlyDialog"></md-input>
            </md-field>
            <md-field>
              <label>Description</label>
              <md-textarea v-model="productObject.description"
                :readonly="readOnlyDialog"></md-textarea>
            </md-field>
            <md-field>
              <label>Type</label>
              <md-select v-model="productObject.productTypeId" :readonly="readOnlyDialog"
                @md-selected="productTypeChange()">
                <md-option v-for="productType in productTypes"
                  :value="productType.id" :key="productType.id">{{ productType.name }}</md-option>
              </md-select>
            </md-field>
            <div class="flex flex-column width-100">
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field>
                    <label>Code</label>
                    <md-input v-model="productObject.productCode"
                      :readonly="readOnlyDialog"></md-input>
                    <md-button class="md-icon-button md-dense"
                      @click="generateRandomCode()" :disabled="readOnlyDialog">
                      <md-icon>autorenew</md-icon>
                    </md-button>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Supplied By</label>
                    <md-select v-model="productObject.suppliedBy" :disabled="readOnlyDialog">
                      <md-option v-for="supplier in suppliers"
                        :value="supplier.id" :key="supplier.id">
                        {{ supplier.name }}
                      </md-option>
                    </md-select>
                  </md-field>
                </div>
              </div>
              <div class="md-layout md-gutter">
                <div class="md-layout-item">
                  <md-field>
                    <label>Price Per Item</label>
                    <md-input v-model="productObject.pricePerItem"
                      :readonly="readOnlyDialog"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item">
                  <md-field>
                    <label>Quantity</label>
                    <md-input v-model="productObject.quantity"
                      :readonly="readOnlyDialog"></md-input>
                  </md-field>
                </div>
              </div>
            </div>
            <div class="md-layout flex-column">
              <div class="md-layout">
                <div class="md-layout-item md-size-25">
                  <h5>Custom Properties</h5>
                </div>
              </div>
              <div v-for="pr in productObject.properties" :key="pr.id"
                class="md-layout md-alignment-center-left">
                <div class="md-layout-item">
                  <md-field v-if="pr.propertyType === 'text'">
                    <label>{{ pr.name }}</label>
                    <md-input v-model="pr.value"
                      :readonly="readOnlyDialog"></md-input>
                  </md-field>
                  <div v-if="pr.propertyType === 'date'">
                    <label>{{ pr.name }}</label>
                    <md-datepicker v-model="pr.value"
                      :readonly="readOnlyDialog" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Close</md-button>
        <md-button class="md-raised md-primary dialog-save-button"
          @click="saveProduct()" :disabled="readOnlyDialog">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <h1>Products</h1>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-size-100">
        <div class="md-layout flex-column">
          <div class="md-layout-item">
            <md-button class="md-raised md-accent margin-0"
              @click="showDialogAsAdd()">Add New</md-button>
          </div>
          <div class="md-layout-item margin-top-16">
            <div class="md-layout">
              <masonry class="flex-1" :cols="3" :gutter="16">
                <md-card class="margin-0" v-for="product in products" :key="product.id">
                  <md-card-header>
                    <div class="md-title">
                      {{ product.name }}
                      <span class="float-right">
                        <md-switch class="margin-0" v-model="product.enabled"
                          @change="enableDisable(product)"></md-switch>
                      </span>
                    </div>
                    <div class="md-subhead">
                      <md-icon>ballot</md-icon>
                      <span class="padding-right-16"> {{ product.quantity }} in stock</span>&nbsp;
                      <md-icon>money</md-icon>
                      <span> {{ product.pricePerItem }} each</span>
                    </div>
                  </md-card-header>

                  <md-card-content>
                    {{ product.description }}
                  </md-card-content>

                  <md-card-actions>
                    <md-button @click="editProduct(product)">Edit</md-button>
                    <md-button @click="viewProduct(product)">View</md-button>
                  </md-card-actions>
                </md-card>
              </masonry>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

  readOnlyDialog: boolean;

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
    this.readOnlyDialog = false;
    this.productObjectCustomProperties = [];
    this.productTypes = Array<ProductType>();
    this.suppliers = Array<Supplier>();
    this.products = Array<Product>();
    this.productObject = {} as Product;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.productObject = this.initProductObject();
    if (this.currentUser) {
      this.$bind('productTypes', db.collection('producttypes').where('storeId', '==', this.currentUser.storeId));
      this.$bind('suppliers', db.collection('suppliers').where('storeId', '==', this.currentUser.storeId));
      this.$bind('products', db.collection('products').where('storeId', '==', this.currentUser.storeId));
    } else {
      this.productTypes = [];
    }
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'add';
  }

  enableDisable(product: Product): void {
    const state = product.enabled;
    db.collection('products').doc(product.id).update({ enabled: state, modifiedAt: new Date() });
  }

  editProduct(product: Product): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'edit';
    this.productObject = product;
  }

  viewProduct(product: Product): void {
    this.showDialog = true;
    this.readOnlyDialog = true;
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
      suppliedBy: '',
      quantity: 0,
      productTypeId: 'EvaKvKXKJCUr8TFyBFxc',
      name: '',
      description: '',
      modifiedAt: new Date(),
      createdAt: new Date(),
      modifiedBy: '',
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
