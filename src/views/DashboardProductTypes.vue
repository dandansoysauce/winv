<template>
  <v-container class="full-height align-start" fluid>
    <div class="d-flex full-height flex-column width-100">
      <h1>Product Categories</h1>
      <div class="d-flex full-height flex-column">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">Add a Category</v-btn>
        </div>
        <div class="with-button-container mt-4" fluid>
          <v-row class="cards-container overflow-y-auto">
            <v-col v-for="productType in productTypes" :key="productType.id"
              cols="12" sm="6" md="4">
              <ProductTypeCard :product-type-info="productType"
                :show-dialog.sync="showDialog"
                :dialog-mode.sync="dialogMode"
                :product-type-object.sync="productTypeObject"></ProductTypeCard>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
    <ProductTypeDialog :dialog-mode="dialogMode" :product-type-object="productTypeObject"
      :show-dialog.sync="showDialog"></ProductTypeDialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import ProductType from '@/interfaces/ProductType';
import User from '@/interfaces/User';
import ProductTypeDialog from '@/components/dialogs/ProductTypeDialog.vue';
import ProductTypeCard from '@/components/cards/ProductTypeCard.vue';

@Component({
  components: {
    ProductTypeDialog,
    ProductTypeCard,
  },
})
export default class DashboardProductTypes extends Vue {
  showDialog: boolean;

  dialogMode: string;

  productTypeObject: ProductType;

  productTypes: ProductType[];

  currentUser: User;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.productTypes = Array<ProductType>();
    this.productTypeObject = {} as ProductType;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.$bind('productTypes', db.collection('producttypes')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
    } else {
      this.productTypes = [];
    }
  }

  showDialogAsAdd(): void {
    this.productTypeObject = this.initProductTypeObject();
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  initProductTypeObject(): ProductType {
    return {
      properties: [],
      name: '',
      description: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
    };
  }
}
</script>
