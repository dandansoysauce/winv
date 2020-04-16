<template>
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
                v-model="restockDialogObject.quantity" type="number"
                min="1" @focus="$event.target.select()"
                :error-messages="errors" required></v-text-field>
            </ValidationProvider>
            <v-textarea label="Notes" filled
              v-model="restockDialogObject.description"></v-textarea>
            <v-switch
              v-model="restockDialogObject.supplierInfoChanged"
              label="Change Supplier Details"
            ></v-switch>
            <ValidationProvider v-slot="{ errors }" name="Supplied By" rules="required">
              <v-select :items="suppliers" v-model="restockDialogObject.suppliedBy"
                item-text="name" item-value="id" filled
                label="Supplied By"
                :error-messages="errors" required
                :disabled="!restockDialogObject.supplierInfoChanged"
              ></v-select>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Old Supplier Price">
              <v-currency-field label="Old Supplier Price" filled
                v-model="restockDialogObject.oldSupplierPrice"
                :error-messages="errors" disabled></v-currency-field>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="New Supplier Price"
              rules="required|min_value:0.01">
              <v-currency-field label="New Supplier Price" filled
                v-model="restockDialogObject.newSupplierPrice"
                :error-messages="errors" :required="restockDialogObject.supplierInfoChanged"
                @input="calculateNewPriceOnRestock()"
                :disabled="!restockDialogObject.supplierInfoChanged"></v-currency-field>
            </ValidationProvider>
            <v-switch
              v-model="restockDialogObject.priceAdjust"
              :disabled="restockDialogObject.percentageAdjust"
              @change="adjustSalePriceChanged(restockDialogObject.priceAdjust)"
              label="Adjust Sale Price"
            ></v-switch>
            <ValidationProvider v-slot="{ errors }" name="Sale Price"
              rules="required|min_value:0.01">
              <v-currency-field label="Sale Price" filled
                v-model="restockDialogObject.newSalePrice"
                :disabled="!restockDialogObject.priceAdjust"
                :error-messages="errors"
                :required="restockDialogObject.priceAdjust"></v-currency-field>
            </ValidationProvider>
            <v-switch
              v-model="restockDialogObject.percentageAdjust"
              :disabled="restockDialogObject.priceAdjust"
              @change="adjustPricePercentageChanged(restockDialogObject.percentageAdjust)"
              label="Adjust Price Percentage"
            ></v-switch>
            <ValidationProvider v-slot="{ errors }" name="Price Percentage"
              rules="required|min_value:0.01">
              <v-currency-field label="Sale Price" filled
                v-model="restockDialogObject.newSalePricePercentage"
                :disabled="!restockDialogObject.percentageAdjust"
                :error-messages="errors"
                :required="restockDialogObject.percentageAdjust"></v-currency-field>
            </ValidationProvider>
          </form>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions class="card-action-padding">
        <v-btn text @click="closeDialog()">Close</v-btn>
        <v-btn color="primary" depressed width="120" @click="saveRestock()">Save</v-btn>
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
import Restock from '@/interfaces/Restock';
import Product from '@/interfaces/Product';
import Supplier from '@/interfaces/Supplier';
import User from '@/interfaces/User';
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
  },
})
export default class RestockDialog extends Vue {
  @Prop() private showRestockDialog!: boolean;

  @Prop() private productObject!: Product;

  @Prop() private suppliers!: Supplier[];

  private restockDialogObject: Restock;

  currentUser: User;

  constructor() {
    super();
    this.restockDialogObject = {} as Restock;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
  }

  @Watch('productObject')
  onProductObjectChanged(value: Product) {
    this.restockDialogObject = this.initRestockObject(value);
  }

  saveRestock(): void {
    (this.$refs.restockObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.closeDialog();
        this.restockDialogObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());
        this.restockDialogObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
        db.collection('restocks').add(this.restockDialogObject).then(() => {
          const suppliedBy = 'suppliedBy';
          const salePrice = 'salePrice';
          const salePricePercentage = 'salePricePercentage';
          const newProductInfo = {
            quantity: Number(this.productObject.quantity) + Number(this.restockDialogObject.quantity),
          };
          if (this.restockDialogObject.supplierInfoChanged) {
            newProductInfo[suppliedBy] = this.restockDialogObject.suppliedBy;
          }

          if (this.restockDialogObject.priceAdjust) {
            newProductInfo[salePrice] = this.restockDialogObject.newSalePrice;
          }

          if (this.restockDialogObject.percentageAdjust) {
            newProductInfo[salePricePercentage] = this.restockDialogObject.newSalePricePercentage;
            if (this.restockDialogObject.supplierInfoChanged
              && (this.restockDialogObject.newSupplierPrice !== this.restockDialogObject.oldSupplierPrice)) {
              newProductInfo[salePrice] = this.restockDialogObject.newSupplierPrice
                + (this.restockDialogObject.newSupplierPrice
                * (this.restockDialogObject.newSalePricePercentage / 100));
            } else {
              newProductInfo[salePrice] = this.productObject.pricePerItem
                + (this.productObject.pricePerItem
                * (this.restockDialogObject.newSalePricePercentage / 100));
            }
          }
          db.collection('products').doc(this.productObject.id).update(newProductInfo);
        });
      });
  }

  adjustSalePriceChanged(changed: boolean) {
    if (!changed) {
      this.restockDialogObject.newSalePrice = this.productObject.salePrice;
    }
  }

  adjustPricePercentageChanged(changed: boolean) {
    if (!changed) {
      this.restockDialogObject.newSalePricePercentage = this.productObject.salePricePercentage;
    }
  }

  closeDialog() {
    this.$emit('update:showRestockDialog', false);
  }

  initRestockObject(product: Product): Restock {
    return {
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
      newSalePricePercentage: product.salePricePercentage,
      percentageAdjust: false,
    };
  }
}
</script>
