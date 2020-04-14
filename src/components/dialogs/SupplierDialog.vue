<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
    <v-card>
      <v-card-title class="headline" primary-title>
        Supplier
      </v-card-title>
      <v-card-text style="max-height: 600px;">
        <ValidationObserver ref="observer">
          <form novalidate autocomplete="off">
            <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
              <v-text-field label="Name" filled v-model="supplierDialogObject.name"
                :error-messages="errors" required></v-text-field>
            </ValidationProvider>
            <v-textarea label="Description" filled
              v-model="supplierDialogObject.description"></v-textarea>
            <ValidationProvider v-slot="{ errors }" name="Address" rules="required">
              <v-textarea label="Address" filled
                v-model="supplierDialogObject.address"
                :error-messages="errors" required></v-textarea>
            </ValidationProvider>
            <v-row>
              <v-col cols="12" sm="6">
                <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                  <v-text-field label="Email" filled
                    v-model="supplierDialogObject.contactEmail"
                    :error-messages="errors" required></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" sm="6">
                <ValidationProvider v-slot="{ errors }" name="Contact Number"
                  rules="required">
                  <v-text-field label="Contact Number" filled
                    v-model="supplierDialogObject.contactNumber"
                    :error-messages="errors" required></v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-textarea label="Other Notes" filled
              v-model="supplierDialogObject.notes"></v-textarea>
          </form>
        </ValidationObserver>
      </v-card-text>
      <v-card-actions class="card-action-padding">
        <v-btn text @click="closeDialog()">Close</v-btn>
        <v-btn color="primary" depressed width="120" @click="saveSupplier()">Save</v-btn>
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
export default class SupplierDialog extends Vue {
  @Prop() private dialogMode!: string;

  @Prop() private showDialog!: boolean;

  @Prop() private supplierObject!: Supplier;

  private supplierDialogObject: Supplier;

  currentUser: User;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.supplierDialogObject = {} as Supplier;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
  }

  @Watch('supplierObject')
  onSupplierObjectChanged(value: Supplier) {
    this.supplierDialogObject = value;
  }

  saveSupplier(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.closeDialog();
        this.supplierDialogObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.supplierDialogObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
          db.collection('suppliers').add(this.supplierDialogObject);
        } else if (this.dialogMode === 'edit') {
          db.collection('suppliers').doc(this.supplierDialogObject.id).set(this.supplierDialogObject);
        }
      });
  }

  closeDialog() {
    this.$emit('update:showDialog', false);
  }
}
</script>
