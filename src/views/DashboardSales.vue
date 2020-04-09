<template>
  <div class="container flex flex-1 flex-column">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Add New Product Type</md-dialog-title>
      <md-dialog-content>
        <form novalidate class="md-layout">
          <div class="md-layout">
            <md-autocomplete v-model="selectedLabel"
              :md-options="sanitizedProducts">
              <label>Product</label>
              <template slot="md-autocomplete-item" slot-scope="{ item, term }">
                <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
              </template>
            </md-autocomplete>
            <md-field>
              <label>Notes</label>
              <md-textarea v-model="saleObject.description"></md-textarea>
            </md-field>
            <div class="md-layout">
              <div class="md-layout-item md-size-15">
                <h5>Properties</h5>
              </div>
              <div class="md-layout-item text-align-right">
                <md-button class="md-fab md-accent">
                  <md-icon>add</md-icon>
                </md-button>
              </div>
            </div>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Close</md-button>
        <md-button class="md-raised md-primary" @click="showDialog = false">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <h1>Sales</h1>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-size-100">
        <div class="md-layout flex-column">
          <div class="md-layout-item">
            <div class="flex-row">
              <md-button class="md-raised md-accent add-button-margin margin-0"
                @click="showDialogAsAdd()">Add Sale</md-button>
              <!-- <md-button class="md-raised md-primary add-button-margin margin-0 margin-left-16"
                @click="showDialogAsAdd()">Bulk</md-button> -->
            </div>
          </div>
          <div class="md-layout-item margin-top-16">
            <div class="md-layout">
              <md-tabs class="flex-1">
                <md-tab id="tab-home" md-label="Overview" md-icon="home"></md-tab>
                <md-tab id="tab-reports" md-label="Reports" md-icon="bar_chart"></md-tab>
                <md-tab id="tab-table" md-label="Tabular"
                  md-icon="table_chart"></md-tab>
              </md-tabs>
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
