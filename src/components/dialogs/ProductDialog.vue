<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
    <v-card>
      <v-card-title class="headline" primary-title>
        Product
      </v-card-title>
      <v-card-text style="max-height: 600px;">
        <ValidationObserver ref="observer">
          <form novalidate autocomplete="off">
            <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
              <v-text-field label="Name" filled v-model="productDialogObject.name"
                :error-messages="errors" required></v-text-field>
            </ValidationProvider>
            <v-textarea label="Description" filled
              v-model="productDialogObject.description"></v-textarea>
            <ValidationProvider v-slot="{ errors }" name="Category" rules="required">
              <v-select :items="productTypes" v-model="productDialogObject.productTypeId"
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
                    v-model="productDialogObject.pricePerItem"
                    :error-messages="errors" required
                    @input="setPricePercentage()"></v-currency-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" sm="6">
                <ValidationProvider v-slot="{ errors }" name="Quantity"
                  rules="required|min_value:1">
                  <v-text-field label="Quantity" filled
                    v-model="productDialogObject.quantity" type="number"
                    min="1" @focus="$event.target.select()"
                    :error-messages="errors" required></v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-switch
              v-model="productDialogObject.manuallySetPrice"
              @change="changeManualPricing(productDialogObject.manuallySetPrice)"
              label="Set Price Manually"
            ></v-switch>
            <ValidationProvider v-slot="{ errors }" name="Price Percentage"
              rules="required">
              <v-currency-field label="Price Percentage" filled
                v-model="productDialogObject.salePricePercentage"
                :error-messages="errors" :required="!productDialogObject.manuallySetPrice"
                :disabled="productDialogObject.manuallySetPrice"
                @input="setPricePercentage()"></v-currency-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Sale Price"
              rules="required|min_value:0.01">
              <v-currency-field label="Sale Price" filled
                v-model="productDialogObject.salePrice"
                :error-messages="errors" :required="productDialogObject.manuallySetPrice"
                :disabled="!productDialogObject.manuallySetPrice"></v-currency-field>
            </ValidationProvider>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Product Code" filled
                  append-icon="mdi-text-box-plus-outline"
                  @click:append="generateRandomCode()"
                  v-model="productDialogObject.productCode" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <ValidationProvider v-slot="{ errors }" name="Supplied By" rules="required">
                  <v-select :items="suppliers" v-model="productDialogObject.suppliedBy"
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
            <v-row v-for="pr in productDialogObject.properties" :key="pr.id">
              <v-col cols="12">
                <ProductProperty :input-type="pr.propertyType"
                  :product-property="pr"></ProductProperty>
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
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import uniqid from 'uniqid';
import Product from '@/interfaces/Product';
import Supplier from '@/interfaces/Supplier';
import ProductType from '@/interfaces/ProductType';
import User from '@/interfaces/User';
import ProductProperty from '@/components/ProductProperty.vue';
import { required, min_value as minValue } from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');
extend('required', {
  ...required,
  message: '{_field_} is required',
});
extend('min_value', {
  ...minValue,
  message: '{_field_} should be at least {min}',
});

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ProductProperty,
  },
})
export default class ProductDialog extends Vue {
  @Prop() private showDialog!: boolean;

  @Prop() private dialogMode!: string;

  @Prop() private suppliers!: Supplier[];

  @Prop() private productTypes!: ProductType[];

  @Prop() private productObject!: Product;

  currentUser: User;

  productDialogObject: Product;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.productDialogObject = {} as Product;
  }

  @Watch('productObject')
  onProductObjectChanged(value: Product) {
    this.productDialogObject = value;
  }

  saveProduct(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.closeDialog();
        this.productDialogObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.productDialogObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          db.collection('products').add(this.productDialogObject);
        } else if (this.dialogMode === 'edit') {
          db.collection('products').doc(this.productDialogObject.id).set(this.productDialogObject);
        }
      });
  }

  changeManualPricing(changed: boolean) {
    if (changed) {
      this.productDialogObject.salePricePercentage = 0;
    } else {
      this.productDialogObject.salePrice = 0;
    }
  }

  setPricePercentage() {
    if (this.productDialogObject.salePricePercentage > 0
      && this.productDialogObject.pricePerItem > 0) {
      this.productDialogObject.salePrice = this.productDialogObject.pricePerItem
        + (this.productDialogObject.pricePerItem
        * (this.productDialogObject.salePricePercentage / 100));
    }
  }

  productTypeChange(): void {
    const getProductType = this.productTypes.filter((x) => x.id
      === this.productDialogObject.productTypeId)[0];
    if (getProductType) {
      this.productDialogObject.properties = getProductType.properties;
    } else {
      this.productDialogObject.properties = [];
    }
  }

  generateRandomCode(): void {
    this.productDialogObject.productCode = uniqid();
  }

  closeDialog() {
    this.$emit('update:showDialog', false);
  }
}
</script>
