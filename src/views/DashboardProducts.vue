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
                      <v-list-item-subtitle>{{ product.pricePerItem }} ea.</v-list-item-subtitle>
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
  <!-- <div class="container flex flex-column">
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
              @click="showDialogAsAdd()">Add Product</md-button>
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
                    <md-button class="md-raised md-primary"
                      @click="editProduct(product)">Restock</md-button>
                  </md-card-actions>
                </md-card>
              </masonry>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
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
    this.readOnlyDialog = false;
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
