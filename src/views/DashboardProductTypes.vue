<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Product Categories</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">Add a Category</v-btn>
        </div>
        <div class="fill-height mt-4">
          <v-row>
            <v-col v-for="productType in productTypes" :key="productType.id"
              cols="12" sm="4">
              <v-card class="mx-auto" raised>
                <v-card-title>
                  {{ productType.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ productType.description }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn text>
                    View
                  </v-btn>
                  <v-btn color="primary" depressed @click="editProductType(productType)">
                    Edit
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
          Product Category
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <form novalidate>
            <v-text-field label="Name" filled v-model="productTypeObject.name"></v-text-field>
            <v-textarea label="Description" filled
              v-model="productTypeObject.description"></v-textarea>
            <div class="d-flex">
              <h4>Custom Properties</h4>
              <v-spacer></v-spacer>
              <v-btn class="mx-2" fab small color="primary" @click="addProperty()">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-row v-for="pr in productTypeObject.properties" :key="pr.id">
              <v-col cols="12" sm="6">
                <v-text-field label="Name" filled v-model="pr.name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="pr.propertyType"
                  :items="['Text', 'Number', 'Date', 'Time', 'Checkbox']"
                  label="Type"
                  filled
                  required
                ></v-select>
              </v-col>
            </v-row>
          </form>
        </v-card-text>
        <v-card-actions class="card-action-padding">
          <v-btn text @click="closeDialog()">Close</v-btn>
          <v-btn color="primary" depressed width="120" @click="saveProductType()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import ProductType from '@/interfaces/ProductType';
import ProductPropertyType from '@/interfaces/ProductPropertyType';
import User from '@/interfaces/User';
import uniqid from 'uniqid';

@Component
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
      this.productTypeObject = this.initProductTypeObject();
      this.$bind('productTypes', db.collection('producttypes')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
    } else {
      this.productTypes = [];
    }
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMode = '';
    this.productTypeObject = this.initProductTypeObject();
  }

  editProductType(productType: ProductType): void {
    this.showDialog = true;
    this.dialogMode = 'edit';
    this.productTypeObject = productType;
  }

  viewProductType(productType: ProductType): void {
    this.showDialog = true;
    this.productTypeObject = productType;
  }

  enableDisable(productType: ProductType): void {
    const state = productType.enabled;
    db.collection('producttypes').doc(productType.id).update({ enabled: state, modifiedAt: new Date() });
  }

  saveProductType(): void {
    this.showDialog = false;
    this.productTypeObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

    if (this.dialogMode === 'add') {
      this.productTypeObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
      db.collection('producttypes').add(this.productTypeObject).then(() => {
        this.productTypeObject = this.initProductTypeObject();
      });
    } else if (this.dialogMode === 'edit') {
      db.collection('producttypes').doc(this.productTypeObject.id).set(this.productTypeObject).then(() => {
        this.productTypeObject = this.initProductTypeObject();
      });
    }
  }

  addProperty() {
    const newProperty = this.generateProperty();
    this.productTypeObject.properties.push(newProperty);
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

  generateProperty(): ProductPropertyType {
    return {
      id: uniqid(),
      name: '',
      propertyType: 'text',
      menu: false,
      value: null,
    };
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
}

.list-container {
  position: absolute;
  top: 153px;
  bottom: 10px;
  right: 6px;
  left: 35%;
  overflow: auto;
}

.add-card-margin-top {
  margin-top: 22px;
}
</style>
