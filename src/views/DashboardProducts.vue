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
                  <v-btn color="pink" depressed dark
                    @click="restockProduct(product)">
                    Restock
                  </v-btn>
                </v-card-actions>
              </v-card>
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
    <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
      <v-card>
        <v-card-title class="headline" primary-title>
          Product
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <ValidationObserver ref="observer">
            <form novalidate>
              <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
                <v-text-field label="Name" filled v-model="productObject.name"
                  :error-messages="errors" required></v-text-field>
              </ValidationProvider>
              <v-textarea label="Description" filled
                v-model="productObject.description"></v-textarea>
              <ValidationProvider v-slot="{ errors }" name="Category" rules="required">
                <v-select :items="productTypes" v-model="productObject.productTypeId"
                  item-text="name" item-value="id" filled
                  label="Category" @input="productTypeChange()"
                  required
                  :error-messages="errors"
                ></v-select>
              </ValidationProvider>
              <v-row>
                <v-col cols="12" sm="6">
                  <ValidationProvider v-slot="{ errors }" name="Supplier Price"
                    rules="required|min_value:0.01">
                    <v-currency-field label="Supplier Price" filled
                      v-model="productObject.pricePerItem"
                      :error-messages="errors" required
                      @input="setPricePercentage()"></v-currency-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" sm="6">
                  <ValidationProvider v-slot="{ errors }" name="Quantity"
                    rules="required|min_value:1">
                    <v-text-field label="Quantity" filled
                      v-model="productObject.quantity" type="number"
                      min="1" @focus="$event.target.select()"
                      :error-messages="errors" required></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <ValidationProvider v-slot="{ errors }" name="Price Percentage"
                rules="required">
                <v-currency-field label="Price Percentage" filled
                  v-model="productObject.salePricePercentage"
                  :error-messages="errors" required
                  @input="setPricePercentage()"></v-currency-field>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Sale Price"
                rules="required|min_value:0.01">
                <v-currency-field label="Sale Price" filled
                  v-model="productObject.salePrice"
                  :error-messages="errors" required
                  :disabled="productObject.salePricePercentage > 0"></v-currency-field>
              </ValidationProvider>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field label="Product Code" filled
                    append-icon="mdi-text-box-plus-outline"
                    @click:append="generateRandomCode()"
                    v-model="productObject.productCode" readonly></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <ValidationProvider v-slot="{ errors }" name="Supplied By" rules="required">
                    <v-select :items="suppliers" v-model="productObject.suppliedBy"
                      item-text="name" item-value="id" filled
                      label="Supplied By"
                      :error-messages="errors" required
                    ></v-select>
                  </ValidationProvider>
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
          </ValidationObserver>
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
import * as firebase from 'firebase/app';
import uniqid from 'uniqid';
import Product from '@/interfaces/Product';
import Supplier from '@/interfaces/Supplier';
import ProductType from '@/interfaces/ProductType';
import ProductPropertyType from '@/interfaces/ProductPropertyType';
import User from '@/interfaces/User';
import Restock from '@/interfaces/Restock';
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
    ValidationObserver,
    ValidationProvider,
  },
})
export default class DashboardProducts extends Vue {
  showDialog: boolean;

  showRestockDialog: boolean;

  dialogMode: string;

  suppliers: Supplier[];

  productTypes: ProductType[];

  productObject: Product;

  productObjectCustomProperties: ProductPropertyType[];

  products: Product[];

  currentUser: User;

  restockObject: Restock;

  constructor() {
    super();
    this.showDialog = false;
    this.showRestockDialog = false;
    this.dialogMode = '';
    this.productObjectCustomProperties = [];
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

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMode = '';
    this.productObject = {} as Product;
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

  saveProduct(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.showDialog = false;
        this.productObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.productObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          db.collection('products').add(this.productObject).then(() => {
            this.productObject = this.initProductObject();
          });
        } else if (this.dialogMode === 'edit') {
          db.collection('products').doc(this.productObject.id).set(this.productObject).then(() => {
            this.productObject = this.initProductObject();
          });
        }
      });
  }

  setPricePercentage() {
    if (this.productObject.salePricePercentage > 0 && this.productObject.pricePerItem > 0) {
      this.productObject.salePrice = this.productObject.pricePerItem
        + (this.productObject.pricePerItem * (this.productObject.salePricePercentage / 100));
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

<style lang="scss" scoped>
.container {
  flex: 1;
}
</style>
