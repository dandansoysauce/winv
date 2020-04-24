<template>
  <v-dialog v-model="showDialog" max-width="600" scrollable persistent>
    <v-card>
      <v-card-title class="headline" primary-title>
        Product Category
      </v-card-title>
      <v-card-text style="max-height: 600px;">
        <ValidationObserver ref="observer">
          <form novalidate autocomplete="off">
            <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
              <v-text-field label="Name" filled v-model="productTypeDialogObject.name"
                :error-messages="errors"></v-text-field>
            </ValidationProvider>
            <v-textarea label="Description" filled
              v-model="productTypeDialogObject.description"></v-textarea>
            <div class="d-flex">
              <h4>Custom Properties</h4>
              <v-spacer></v-spacer>
              <v-btn class="mx-2" fab small color="primary" @click="addProperty()">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-row v-for="pr in productTypeDialogObject.properties" :key="pr.id">
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
        </ValidationObserver>
      </v-card-text>
      <v-card-actions class="card-action-padding">
        <v-btn text @click="closeDialog()">Close</v-btn>
        <v-btn color="primary" depressed width="120" @click="saveProductType()">Save</v-btn>
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
import ProductType from '@/interfaces/ProductType';
import ProductPropertyType from '@/interfaces/ProductPropertyType';
import User from '@/interfaces/User';
import uniqid from 'uniqid';
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
export default class ProductTypeDialog extends Vue {
  @Prop() private showDialog!: boolean;

  @Prop() private dialogMode!: string;

  @Prop() private productTypeObject!: ProductType;

  private productTypeDialogObject: ProductType;

  currentUser: User;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.productTypeDialogObject = {} as ProductType;
  }

  @Watch('productTypeObject')
  onProductTypeObjectChanged(value: ProductType) {
    this.productTypeDialogObject = value;
  }

  saveProductType(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.closeDialog();
        this.productTypeDialogObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());

        if (this.dialogMode === 'add') {
          this.productTypeDialogObject.createdAt = firebase
            .firestore.Timestamp.fromDate(new Date());
          db.collection('producttypes').add(this.productTypeDialogObject);
        } else if (this.dialogMode === 'edit') {
          db.collection('producttypes').doc(this.productTypeDialogObject.id).set(this.productTypeDialogObject);
        }
      });
  }

  addProperty() {
    const newProperty = this.generateProperty();
    this.productTypeDialogObject.properties.push(newProperty);
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

  closeDialog() {
    this.$emit('update:showDialog', false);
  }
}
</script>
