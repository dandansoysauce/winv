<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
    <v-card>
      <v-card-title class="headline" primary-title>
        Sale
      </v-card-title>
      <v-card-text style="max-height: 600px;">
        <ValidationObserver ref="observer">
          <form novalidate autocomplete="off">
            <ValidationProvider v-slot="{ errors }" name="Product" rules="required">
              <v-autocomplete :items="products"
                v-model="saleDialogObject.productId"
                :error-messages="errors"
                :loading="searchLoading"
                :search-input.sync="searchText"
                hide-no-data
                hide-selected item-text="name"
                item-value="id"
                label="Product"
                prepend-icon="mdi-database-search"
                filled
                @input="productSelected()"
                required></v-autocomplete>
            </ValidationProvider>
            <ValidationProvider v-slot="{ errors }" name="Quantity"
              rules="required|min_value:1">
              <v-text-field label="Quantity" filled v-model="saleDialogObject.quantity"
                @input="calculateSale()" type="number" min="1"
                @focus="$event.target.select()" required
                :error-messages="errors"></v-text-field>
            </ValidationProvider>
            <v-currency-field label="Total Sale" filled v-model="saleDialogObject.totalSale"
              readonly></v-currency-field>
            <v-textarea label="Notes" filled v-model="saleDialogObject.description"></v-textarea>
          </form>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions class="card-action-padding">
        <v-btn text @click="closeDialog()">Close</v-btn>
        <v-btn color="primary" depressed width="120" @click="saveSale()">Save</v-btn>
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
import Sale from '@/interfaces/Sale';
import Product from '@/interfaces/Product';
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
export default class SaleDialog extends Vue {
  @Prop() private showDialog!: boolean;

  @Prop() private dialogMode!: string;

  @Prop() private products!: Product[];

  @Prop() private saleObject!: Sale;

  private saleDialogObject: Sale;

  currentUser: User;

  searchText: string;

  searchLoading: boolean;

  selectedProduct: Product;

  constructor() {
    super();
    this.searchText = '';
    this.searchLoading = false;
    this.selectedProduct = {} as Product;
    this.currentUser = {} as User;
    this.saleDialogObject = {} as Sale;
  }

  productSelected() {
    if (this.saleDialogObject.productId.length > 0) {
      [this.selectedProduct] = this.products
        .filter((x) => x.id === this.saleDialogObject.productId);
      this.saleDialogObject.productName = this.selectedProduct.name;
      this.saleDialogObject.productSupplierPrice = this.selectedProduct.pricePerItem;
      this.calculateSale();
    }
  }

  calculateSale() {
    if (this.saleDialogObject.quantity && this.selectedProduct.id) {
      this.saleDialogObject.totalSale = this.saleDialogObject.quantity
        * this.selectedProduct.salePrice;
    }
  }

  saveSale() {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.closeDialog();
        this.saleDialogObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.saleDialogObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          this.saleDialogObject.dateSale = firebase.firestore.Timestamp.fromDate(new Date());
          db.collection('sales').add(this.saleDialogObject).then(() => {
            db.collection('products').doc(this.saleDialogObject.productId).get().then((snap) => {
              const getProduct = snap.data() as Product;
              const newQuantity = getProduct.quantity - this.saleDialogObject.quantity;
              db.collection('products').doc(this.saleDialogObject.productId).update({ quantity: newQuantity });
            });
          });
        } else if (this.dialogMode === 'edit') {
          db.collection('sales').doc(this.saleDialogObject.id).set(this.saleDialogObject);
        }
      });
  }

  @Watch('saleObject')
  onSaleObjectChanged(value: Sale) {
    this.saleDialogObject = value;
  }

  closeDialog() {
    this.$emit('update:showDialog', false);
  }
}
</script>
