<template>
  <div class="container flex flex-column">
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
      <div class="md-layout-item md-large-size-100 md-xlarge-size-35">
        <md-button class="md-raised md-accent add-button-margin"
          @click="showDialog = true">Add New</md-button>
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

  constructor() {
    super();
    this.showDialog = false;
    this.supplierObject = this.initAddNewSupplier();
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
