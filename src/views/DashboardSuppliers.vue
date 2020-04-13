<template>
  <v-container class="fill-height align-start">
    <div class="d-flex flex-column fill-height width-100">
      <h1>Suppliers</h1>
      <div class="d-flex flex-column fill-height">
        <div class="d-flex mt-2">
          <v-btn raised color="primary" @click="showDialogAsAdd()">Add Supplier</v-btn>
        </div>
        <div class="fill-height mt-4">
          <v-row>
            <v-col v-for="supplier in suppliers" :key="supplier.id"
              cols="12" sm="4">
              <v-card class="mx-auto" raised>
                <v-card-title>
                  {{ supplier.name }}
                </v-card-title>
                <v-card-subtitle>
                  {{ supplier.description }}
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn text>
                    View
                  </v-btn>
                  <v-btn color="primary" depressed @click="editSupplier(supplier)">
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
          Supplier
        </v-card-title>
        <v-card-text style="max-height: 600px;">
          <ValidationObserver ref="observer">
            <form novalidate autocomplete="off">
              <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
                <v-text-field label="Name" filled v-model="supplierObject.name"
                  :error-messages="errors" required></v-text-field>
              </ValidationProvider>
              <v-textarea label="Description" filled
                v-model="supplierObject.description"></v-textarea>
              <ValidationProvider v-slot="{ errors }" name="Address" rules="required">
                <v-textarea label="Address" filled
                  v-model="supplierObject.address"
                  :error-messages="errors" required></v-textarea>
              </ValidationProvider>
              <v-row>
                <v-col cols="12" sm="6">
                  <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                    <v-text-field label="Email" filled
                      v-model="supplierObject.contactEmail"
                      :error-messages="errors" required></v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12" sm="6">
                  <ValidationProvider v-slot="{ errors }" name="Contact Number"
                    rules="required">
                    <v-text-field label="Contact Number" filled
                      v-model="supplierObject.contactNumber"
                      :error-messages="errors" required></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-textarea label="Other Notes" filled
                v-model="supplierObject.notes"></v-textarea>
            </form>
          </ValidationObserver>
        </v-card-text>
        <v-card-actions class="card-action-padding">
          <v-btn text @click="closeDialog()">Close</v-btn>
          <v-btn color="primary" depressed width="120" @click="saveSupplier()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import Supplier from '@/interfaces/Supplier';
import User from '@/interfaces/User';
import { required, email } from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');
extend('required', {
  ...required,
  message: '{_field_} is required',
});

extend('email', {
  ...email,
  message: '{_field_} must be a valid email',
});

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class DashboardSuppliers extends Vue {
  showDialog: boolean;

  dialogMode: string;

  supplierObject: Supplier;

  suppliers: Supplier[];

  currentUser: User;

  constructor() {
    super();
    this.showDialog = false;
    this.dialogMode = '';
    this.suppliers = Array<Supplier>();
    this.currentUser = {} as User;
    this.supplierObject = {} as Supplier;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      this.supplierObject = this.initAddNewSupplier();
      this.$bind('suppliers', db.collection('suppliers')
        .where('storeId', '==', this.currentUser.storeId)
        .orderBy('name'));
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
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
    };
  }

  showDialogAsAdd(): void {
    this.showDialog = true;
    this.dialogMode = 'add';
  }

  closeDialog(): void {
    this.showDialog = false;
    this.dialogMode = '';
    this.supplierObject = this.initAddNewSupplier();
  }

  saveSupplier(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.showDialog = false;
        this.supplierObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.supplierObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          db.collection('suppliers').add(this.supplierObject).then(() => {
            this.supplierObject = this.initAddNewSupplier();
          });
        } else if (this.dialogMode === 'edit') {
          db.collection('suppliers').doc(this.supplierObject.id).set(this.supplierObject).then(() => {
            this.supplierObject = this.initAddNewSupplier();
          });
        }
      });
  }

  editSupplier(supplier: Supplier): void {
    this.showDialog = true;
    this.dialogMode = 'edit';
    this.supplierObject = supplier;
  }

  enableDisable(supplier: Supplier): void {
    const state = supplier.enabled;
    db.collection('suppliers').doc(supplier.id).update({ enabled: state, modifiedAt: new Date() });
  }

  viewSupplier(supplier: Supplier): void {
    this.showDialog = true;
    this.supplierObject = supplier;
  }
}
</script>

<style lang="scss" scoped>
.supplier-cards {
  margin: 0;
}
</style>
