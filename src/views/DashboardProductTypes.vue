<template>
  <div class="container flex flex-column">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Product Type</md-dialog-title>
      <md-dialog-content class="md-scrollbar">
        <form novalidate class="md-layout">
          <div class="md-layout">
            <md-field>
              <label>Name</label>
              <md-input v-model="productTypeObject.name" :readonly="readOnlyDialog"></md-input>
            </md-field>
            <md-field>
              <label>Description</label>
              <md-textarea v-model="productTypeObject.description"
                :readonly="readOnlyDialog"></md-textarea>
            </md-field>
            <div class="md-layout flex-column">
              <div class="md-layout">
                <div class="md-layout-item md-size-25">
                  <h5>Custom Properties</h5>
                </div>
                <div class="md-layout-item text-align-right">
                  <md-button class="md-fab md-accent" @click="addProperty()"
                    :disabled="readOnlyDialog">
                    <md-icon>add</md-icon>
                  </md-button>
                </div>
              </div>
              <div v-for="pr in productTypeObject.properties" :key="pr.id"
                class="md-layout md-alignment-center-left">
                <div class="md-layout-item md-size-55 padding-right-16">
                  <md-field>
                    <label>Name</label>
                    <md-input v-model="pr.name" :readonly="readOnlyDialog"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-35">
                  <md-field>
                    <label>Type</label>
                    <md-select v-model="pr.propertyType" :readonly="readOnlyDialog">
                      <md-option value="text">Text</md-option>
                      <md-option value="number">Number</md-option>
                      <md-option value="date">Date</md-option>
                      <md-option value="bool">Checkbox</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-10">
                  <md-button class="md-icon-button md-dense md-primary" :disabled="readOnlyDialog">
                    <md-icon>close</md-icon>
                  </md-button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Close</md-button>
        <md-button class="md-raised md-primary dialog-save-button"
          @click="saveProductType()" :disabled="readOnlyDialog">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <h1>Product Types</h1>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-size-100">
        <div class="md-layout flex-column">
          <div class="md-layout-item">
            <md-button class="md-raised md-accent margin-0"
              @click="showDialogAsAdd()">Add New</md-button>
          </div>
          <div class="md-layout-item margin-top-16">
            <div class="md-layout">
              <masonry class="flex-1" :cols="3" :gutter="16">
                <md-card class="margin-0" v-for="productType in productTypes" :key="productType.id">
                  <md-card-header>
                    <div class="md-title">
                      {{ productType.name }}
                      <span class="float-right">
                        <md-switch class="margin-0" v-model="productType.enabled"
                          @change="enableDisable(productType)"></md-switch>
                      </span>
                    </div>
                  </md-card-header>

                  <md-card-content>
                    {{ productType.description }}
                  </md-card-content>

                  <md-card-actions>
                    <md-button @click="editProductType(productType)">Edit</md-button>
                    <md-button @click="viewProductType(productType)">View</md-button>
                  </md-card-actions>
                </md-card>
              </masonry>
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
import ProductType from '@/interfaces/ProductType';
import ProductPropertyType from '@/interfaces/ProductPropertyType';
import User from '@/interfaces/User';
import uniqid from 'uniqid';

@Component
export default class DashboardProductTypes extends Vue {
  showDialog: boolean;

  dialogMode: string;

  readOnlyDialog: boolean;

  productTypeObject: ProductType;

  productTypes: ProductType[];

  currentUser: User;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.readOnlyDialog = false;
    this.productTypes = Array<ProductType>();
    this.productTypeObject = {} as ProductType;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.productTypeObject = this.initProductTypeObject();
    if (this.currentUser) {
      this.$bind('productTypes', db.collection('producttypes').where('storeId', '==', this.currentUser.storeId));
    } else {
      this.productTypes = [];
    }
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'add';
  }

  editProductType(productType: ProductType): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'edit';
    this.productTypeObject = productType;
  }

  viewProductType(productType: ProductType): void {
    this.showDialog = true;
    this.readOnlyDialog = true;
    this.productTypeObject = productType;
  }

  enableDisable(productType: ProductType): void {
    const state = productType.enabled;
    db.collection('producttypes').doc(productType.id).update({ enabled: state, modifiedAt: new Date() });
  }

  saveProductType(): void {
    this.showDialog = false;
    this.productTypeObject.modifiedAt = new Date();

    if (this.dialogMode === 'add') {
      this.productTypeObject.createdAt = new Date();
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
      modifiedAt: new Date(),
      createdAt: new Date(),
      modifiedBy: '',
      enabled: true,
      storeId: this.currentUser.storeId,
    };
  }

  generateProperty(): ProductPropertyType {
    return {
      id: uniqid(),
      name: '',
      propertyType: 'text',
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
