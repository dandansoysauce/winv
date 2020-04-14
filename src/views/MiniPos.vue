<template>
  <div class="full-height">
    <md-app class="full-height" md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title toolbar-title">SimpleWonder Mini POS</span>
        <span class="flex-1"></span>
        <md-button to="/dashboard">EXIT POS</md-button>
      </md-app-toolbar>

      <md-app-content class="flex flex-column">
        <div class="flex flex-column">
          <div class="flex-row">
            <md-button class="md-raised md-accent"
              @click="newTransaction()">New Transaction (F2)</md-button>
          </div>
          <div class="flex flex-row">
            <div class="row-field-width-small">
              <md-field class="field-alt-style">
                <label>PRODUCT CODE</label>
                <md-input v-model="productToAdd" ref="productInput"
                  v-on:keyup.enter="enterProduct()"></md-input>
              </md-field>
            </div>
            <div class="flex flex-items-center margin-left-16">
              <md-button class="md-raised md-accent"
                @click="enterProduct()">ADD (ENTER)</md-button>
            </div>
            <div class="row-field-width-small margin-left-16 flex flex-items-center">
              <md-menu md-size="auto">
                <md-button class="md-raised md-accent" md-menu-trigger>
                  SEARCH FOR PRODUCT (F6)
                </md-button>

                <md-menu-content>
                  <md-menu-item>My Item 1</md-menu-item>
                  <md-menu-item>This content is long enough</md-menu-item>
                  <md-menu-item>My Item 3</md-menu-item>
                </md-menu-content>
              </md-menu>
            </div>
          </div>
        </div>
        <div class="md-layout flex-1">
          <div class="md-layout-item md-size-75">
            <md-table class="field-alt-style" md-card>
              <md-table-row>
                <md-table-head md-numeric>ID</md-table-head>
                <md-table-head>Name</md-table-head>
                <md-table-head>Email</md-table-head>
                <md-table-head>Gender</md-table-head>
                <md-table-head>Job Title</md-table-head>
              </md-table-row>
            </md-table>
          </div>
          <div class="flex flex-column md-layout-item md-size-25 padding-left-16 padding-right-16">
            <md-card v-if="productSelected.name">
              <md-card-header>
                <div class="md-title">{{ productSelected.name }}</div>
                <div class="md-subhead">{{ productSelected.pricePerItem }} each</div>
              </md-card-header>
              <md-card-content>
                {{ productSelected.description }}
                <md-field>
                  <label>Quantity</label>
                  <md-input v-model="productSelected.quantity"
                    type="number" ref="prodQuantity"></md-input>
                </md-field>
              </md-card-content>
              <md-card-actions>
                <md-button>Cancel (ESC)</md-button>
                <md-button class="md-raised md-accent">Confirm (ENTER)</md-button>
              </md-card-actions>
            </md-card>
          </div>
        </div>
      </md-app-content>
    </md-app>
    <md-snackbar md-position="left" :md-duration="3000"
      :md-active.sync="showSnackbar">
      <span>{{ snackbarMessage }}</span>
    </md-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Product from '@/interfaces/Product';
import ProductTransaction from '@/interfaces/ProductTransaction';

@Component
export default class Dashboard extends Vue {
  products: Product[];

  productToAdd: string;

  productSelected: ProductTransaction;

  showSnackbar: boolean;

  snackbarMessage: string;

  constructor() {
    super();
    this.products = this.$root.$data.products;
    this.productToAdd = '1k8br3z9g';
    this.productSelected = {} as Product;
    this.showSnackbar = false;
    this.snackbarMessage = '';
  }

  enterProduct(): void {
    if (this.productToAdd.length === 0) {
      this.showSnackbar = true;
      this.snackbarMessage = 'Enter product code.';
    } else {
      const searchProduct = this.products.filter((x) => x.productCode === this.productToAdd);
      if (searchProduct.length > 0) {
        [this.productSelected] = searchProduct;
        this.productSelected.quantity = 1;
        setTimeout(() => {
          ((this.$refs.prodQuantity as Vue).$el as HTMLElement).focus();
        }, 200);
      }
    }
  }

  newTransaction(): void {
    ((this.$refs.productInput as Vue).$el as HTMLElement).focus();
  }
}
</script>

<style lang="scss" scoped>
.field-alt-style {
  margin: 6px 8px;
}

.row-field-width-small {
  width: 300px;
}
</style>
