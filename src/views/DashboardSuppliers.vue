<template>
  <div class="container flex flex-column flex-1">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Add New Supplier</md-dialog-title>
      <md-dialog-content class="md-scrollbar">
        <form novalidate class="md-layout" autocomplete="off">
          <div class="md-layout">
            <md-field>
              <label>Name</label>
              <md-input v-model="supplierObject.Name"></md-input>
            </md-field>
            <md-field>
              <label>Description</label>
              <md-textarea v-model="supplierObject.Description"></md-textarea>
            </md-field>
            <md-field>
              <label>Address</label>
              <md-textarea v-model="supplierObject.Address"></md-textarea>
            </md-field>
            <md-field>
              <label>Email</label>
              <md-input v-model="supplierObject.ContactEmail"></md-input>
            </md-field>
            <md-field>
              <label>Contact Number</label>
              <md-input v-model="supplierObject.ContactNumber"></md-input>
            </md-field>
            <md-field>
              <label>Notes</label>
              <md-textarea v-model="supplierObject.Notes"></md-textarea>
            </md-field>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Close</md-button>
        <md-button class="md-raised md-primary dialog-save-button"
          @click="addNewSupplier()">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-size-100">
        <div class="md-layout flex-column">
          <div class="md-layout-item">
            <md-button class="md-raised md-accent add-button-margin"
              @click="showDialog = true">Add New</md-button>
          </div>
          <div class="md-layout-item">
            <div class="md-layout">
              <div class="md-layout-item" v-for="supplier in suppliers" :key="supplier.id">
                {{ supplier.Name }}
              </div>
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

@Component
export default class DashboardSuppliers extends Vue {
  showDialog: boolean;

  supplierObject: Supplier;

  suppliers: Supplier[];

  constructor() {
    super();
    this.showDialog = false;
    this.supplierObject = this.initAddNewSupplier();
    this.suppliers = this.$root.$data.suppliers;
  }

  initAddNewSupplier(): Supplier {
    return {
      Address: '',
      ContactEmail: '',
      ContactNumber: '',
      Notes: '',
      Name: '',
      Description: '',
      ModifiedAt: new Date(),
      CreatedAt: new Date(),
      ModifiedBy: '',
    };
  }

  addNewSupplier(): void {
    this.showDialog = false;
    this.supplierObject.CreatedAt = new Date();
    this.supplierObject.ModifiedAt = new Date();

    db.collection('suppliers').add(this.supplierObject).then(() => {
      this.supplierObject = this.initAddNewSupplier();
    });
  }
}
</script>
