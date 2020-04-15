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
              cols="12" sm="6" md="4">
              <ProductCard :product-info="product"
                :show-dialog.sync="showDialog"
                :dialog-mode.sync="dialogMode"
                :product-object.sync="productObject"></ProductCard>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <v-dialog v-model="showRestockDialog" max-width="600" scrollable persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          Restock
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <ValidationObserver ref="restockObserver">
            <form novalidate>
              <ValidationProvider v-slot="{ errors }" name="Quantity"
                rules="required|min_value:1">
                <v-text-field label="Quantity" filled
                  v-model="restockObject.quantity" type="number"
                  min="1" @focus="$event.target.select()"
                  :error-messages="errors" required></v-text-field>
              </ValidationProvider>
              <v-textarea label="Notes" filled
                v-model="restockObject.description"></v-textarea>
              <v-checkbox
                v-model="restockObject.supplierInfoChanged"
                label="Change Other Details"
              ></v-checkbox>
              <v-sheet v-if="restockObject.supplierInfoChanged">
                <ValidationProvider v-slot="{ errors }" name="Supplied By" rules="required">
                  <v-select :items="suppliers" v-model="restockObject.suppliedBy"
                    item-text="name" item-value="id" filled
                    label="Supplied By"
                    :error-messages="errors" required
                  ></v-select>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="New Supplier Price"
                  rules="required|min_value:0.01">
                  <v-currency-field label="New Supplier Price" filled
                    v-model="restockObject.newSupplierPrice"
                    :error-messages="errors" required
                    @input="calculateNewPriceOnRestock()"></v-currency-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Old Supplier Price">
                  <v-currency-field label="Old Supplier Price" filled
                    v-model="restockObject.oldSupplierPrice"
                    :error-messages="errors" disabled></v-currency-field>
                </ValidationProvider>
                <v-checkbox
                  v-model="restockObject.priceAdjust"
                  label="Adjust Sale Price"
                ></v-checkbox>
                <ValidationProvider v-slot="{ errors }" name="Sale Price">
                  <v-currency-field label="Sale Price" filled
                    v-model="restockObject.newSalePrice"
                    :disabled="!restockObject.priceAdjust"
                    :error-messages="errors" required></v-currency-field>
                </ValidationProvider>
              </v-sheet>
            </form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions class="card-action-padding">
          <v-btn text @click="showRestockDialog = false">Close</v-btn>
          <v-btn color="primary" depressed width="120" @click="saveRestock()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import ProductCard from '@/components/cards/ProductCard.vue';

@Component({
  components: {
    ProductDialog,
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

  restockProduct(product: Product): void {
    this.productObject = product;
    this.restockObject = {
      restockDate: firebase.firestore.Timestamp.fromDate(new Date()),
      quantity: 0,
      suppliedBy: product.suppliedBy,
      productId: product.id ?? '',
      newSupplierPrice: product.pricePerItem,
      oldSupplierPrice: product.pricePerItem,
      storeId: this.currentUser.storeId,
      name: '',
      description: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      supplierInfoChanged: false,
      priceAdjust: false,
      newSalePrice: product.salePrice,
    };

    this.showRestockDialog = true;
  }

  calculateNewPriceOnRestock() {
    if (this.productObject.salePricePercentage > 0) {
      this.restockObject.newSalePrice = this.restockObject.newSupplierPrice
        + (this.restockObject.newSupplierPrice
        * (this.productObject.salePricePercentage / 100));
    } else if (this.restockObject.oldSupplierPrice !== this.restockObject.newSupplierPrice) {
      this.restockObject.priceAdjust = true;
    }
  }

  saveRestock(): void {
    (this.$refs.restockObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.showRestockDialog = false;
        this.restockObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());
        this.restockObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
        db.collection('restocks').add(this.restockObject).then(() => {
          const newProductInfo = {
            quantity: Number(this.productObject.quantity) + Number(this.restockObject.quantity),
          };
          let salePrice;
          let suppliedBy;
          if (this.restockObject.supplierInfoChanged) {
            suppliedBy = this.restockObject.suppliedBy;
            // eslint-disable-next-line dot-notation
            newProductInfo['suppliedBy'] = suppliedBy;
            if (this.restockObject.priceAdjust || this.productObject.salePricePercentage > 0) {
              if (this.restockObject.newSupplierPrice !== this.restockObject.oldSupplierPrice) {
                salePrice = this.restockObject.newSalePrice;
                // eslint-disable-next-line dot-notation
                newProductInfo['salePrice'] = salePrice;
              }
            }
          }
          db.collection('products').doc(this.productObject.id).update(newProductInfo).then(() => {
            this.productObject = this.initProductObject();
            this.restockObject = {} as Restock;
          });
        });
      });
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
    };
  }
}
</script>
