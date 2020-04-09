<template>
  <div class="container flex flex-column flex-1">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Supplier</md-dialog-title>
      <md-dialog-content class="md-scrollbar">
        <form novalidate class="md-layout" autocomplete="off">
          <div class="md-layout">
            <md-field>
              <label>Name</label>
              <md-input v-model="supplierObject.name" required
                :readonly="readOnlyDialog"></md-input>
            </md-field>
            <md-field>
              <label>Description</label>
              <md-textarea v-model="supplierObject.description" required
                :readonly="readOnlyDialog"></md-textarea>
            </md-field>
            <md-field>
              <label>Address</label>
              <md-textarea v-model="supplierObject.address"
                :readonly="readOnlyDialog"></md-textarea>
            </md-field>
            <md-field>
              <label>Email</label>
              <md-input v-model="supplierObject.contactEmail" required
                :readonly="readOnlyDialog"></md-input>
            </md-field>
            <md-field>
              <label>Contact Number</label>
              <md-input v-model="supplierObject.contactNumber" required
                :readonly="readOnlyDialog"></md-input>
            </md-field>
            <md-field>
              <label>Notes</label>
              <md-textarea v-model="supplierObject.notes"
                :readonly="readOnlyDialog"></md-textarea>
            </md-field>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false"
          :readonly="readOnlyDialog">Close</md-button>
        <md-button class="md-raised md-primary dialog-save-button"
          @click="saveSupplier()" :disabled="readOnlyDialog">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <h1>Suppliers</h1>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-size-100">
        <div class="md-layout flex-column">
          <div class="md-layout-item">
            <md-button class="md-raised md-accent add-button-margin margin-0"
              @click="showDialogAsAdd()">Add Supplier</md-button>
          </div>
          <div class="md-layout-item margin-top-16">
            <div class="md-layout">
              <masonry class="flex-1" :cols="3" :gutter="16">
                <md-card class="supplier-cards" v-for="supplier in suppliers" :key="supplier.id">
                  <md-card-header>
                    <div class="md-title">
                      {{ supplier.name }}
                      <span class="float-right">
                        <md-switch class="margin-0" v-model="supplier.enabled"
                          @change="enableDisable(supplier)"></md-switch>
                      </span>
                    </div>
                  </md-card-header>

                  <md-card-content>
                    {{ supplier.description }}
                  </md-card-content>

                  <md-card-actions>
                    <md-button @click="editSupplier(supplier)">Edit</md-button>
                    <md-button @click="viewSupplier(supplier)">View</md-button>
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
import Supplier from '@/interfaces/Supplier';
import User from '@/interfaces/User';

@Component
export default class DashboardSuppliers extends Vue {
  showDialog: boolean;

  dialogMode: string;

  readOnlyDialog: boolean;

  supplierObject: Supplier;

  suppliers: Supplier[];

  currentUser: User;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.readOnlyDialog = false;
    this.suppliers = Array<Supplier>();
    this.currentUser = {} as User;
    this.supplierObject = {} as Supplier;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.supplierObject = this.initAddNewSupplier();
    if (this.currentUser) {
      this.$bind('suppliers', db.collection('suppliers').where('storeId', '==', this.currentUser.storeId));
    } else {
      this.suppliers = [];
    }
  }

  initAddNewSupplier(): Supplier {
    return {
      address: '',
      contactEmail: '',
      contactNumber: '',
      notes: '',
      name: '',
      description: '',
      modifiedAt: new Date(),
      createdAt: new Date(),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
    };
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'add';
  }

  saveSupplier(): void {
    this.showDialog = false;
    this.supplierObject.modifiedAt = new Date();

    if (this.dialogMode === 'add') {
      this.supplierObject.createdAt = new Date();
      db.collection('suppliers').add(this.supplierObject).then(() => {
        this.supplierObject = this.initAddNewSupplier();
      });
    } else if (this.dialogMode === 'edit') {
      db.collection('suppliers').doc(this.supplierObject.id).set(this.supplierObject).then(() => {
        this.supplierObject = this.initAddNewSupplier();
      });
    }
  }

  editSupplier(supplier: Supplier): void {
    this.showDialog = true;
    this.readOnlyDialog = false;
    this.dialogMode = 'edit';
    this.supplierObject = supplier;
  }

  enableDisable(supplier: Supplier): void {
    const state = supplier.enabled;
    db.collection('suppliers').doc(supplier.id).update({ enabled: state, modifiedAt: new Date() });
  }

  viewSupplier(supplier: Supplier): void {
    this.showDialog = true;
    this.readOnlyDialog = true;
    this.supplierObject = supplier;
  }
}
</script>

<style lang="scss" scoped>
.supplier-cards {
  margin: 0;
}
</style>
