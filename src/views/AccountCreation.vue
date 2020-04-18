<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="600" raised>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4">SimpleWonder Inventory</div>
              <v-list-item-title class="headline mb-1">Sign Up</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <form novalidate autocomplete="off">
              <v-stepper v-model="active">
                <v-stepper-header>
                  <v-stepper-step :complete="active > 1" step="1">
                    Basic Information
                    <small>About You</small>
                  </v-stepper-step>
                  <v-stepper-step step="2">
                    Store Information
                    <small>Store/Company</small>
                  </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                  <v-stepper-content step="1">
                    <ValidationObserver ref="basicObserver">
                      <form novalidate autocomplete="off">
                        <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
                          <v-text-field label="Name" filled v-model="userObject.name"
                            prepend-icon="mdi-textbox"
                            :error-messages="errors"
                            required></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                          <v-text-field label="Email" filled v-model="userObject.email"
                            prepend-icon="mdi-at" :error-messages="errors"
                            required></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" name="Phone Number"
                          rules="required">
                          <v-text-field label="Phone Number" filled
                            v-model="userObject.phoneNumber"
                            prepend-icon="mdi-cellphone" :error-messages="errors"
                            required></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }"
                          name="Password" rules="required|confirmed:confirmation|min:8"
                          >
                          <v-text-field label="Password" filled
                            v-model="userObject.password"
                            prepend-icon="mdi-textbox-password"
                            :error-messages="errors"
                            type="password"
                            required></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" name="Password Confirmation"
                          rules="required|min:8" vid="confirmation">
                          <v-text-field label="Confirm Password" filled
                            v-model="confirmPassword"
                            prepend-icon="mdi-textbox-password"
                            :error-messages="errors"
                            type="password"
                            required></v-text-field>
                        </ValidationProvider>
                      </form>
                    </ValidationObserver>

                    <v-btn depressed to="/" class="mr-2">Cancel</v-btn>
                    <v-btn depressed color="primary" @click="continueStep(2)"
                      width="160">Continue</v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <ValidationObserver ref="storeObserver">
                      <form novalidate autocomplete="off">
                        <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
                          <v-text-field label="Name" filled
                            v-model="storeObject.storeName"
                            prepend-icon="mdi-textbox"
                            :error-messages="errors"
                            required></v-text-field>
                        </ValidationProvider>
                        <ValidationProvider v-slot="{ errors }" name="Address" rules="required">
                          <v-textarea label="Address" filled
                            v-model="storeObject.storeAddress"
                            prepend-icon="mdi-map-marker"
                            :error-messages="errors"
                            required></v-textarea>
                        </ValidationProvider>
                      </form>
                    </ValidationObserver>

                    <v-btn depressed @click="continueStep(1)" class="mr-2">Back</v-btn>
                    <v-btn depressed color="primary" @click="registerAccount()"
                      width="160">Register</v-btn>
                  </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import User from '@/interfaces/User';
import Store from '@/interfaces/Store';
import Settings from '@/interfaces/Settings';
import uniqid from 'uniqid';
import {
  required, email, confirmed, min,
} from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: '{_field_} is required.',
});

extend('email', {
  ...email,
  message: '{_field_} must be valid.',
});

extend('confirmed', {
  ...confirmed,
  message: '{_field_} does not match.',
});

extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters.',
});

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class AccountCreation extends Vue {
  active: number;

  userObject: User;

  storeObject: Store;

  confirmPassword: string;

  // hasInviteCode: string;

  constructor() {
    super();
    this.active = 1;
    this.userObject = {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      emailVerified: false,
    };
    this.storeObject = {
      storeName: '',
      storeAddress: '',
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
    };
    this.confirmPassword = '';
  }

  continueStep(step: number) {
    (this.$refs.basicObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        this.active = step;
      });
  }

  registerAccount() {
    (this.$refs.basicObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        firebase.auth().createUserWithEmailAndPassword(this.userObject.email, this.userObject.password ?? '')
          .then((data) => {
            this.storeObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
            this.storeObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());
            this.storeObject.inviteCode = uniqid();
            db.collection('stores').add(this.storeObject).then((res) => {
              delete this.userObject.password;
              this.userObject.id = data?.user?.uid;
              this.userObject.createdAt = firebase.firestore.Timestamp.fromDate(new Date());
              this.userObject.modifiedAt = firebase.firestore.Timestamp.fromDate(new Date());
              this.userObject.storeId = res.id;
              this.userObject.emailVerified = data?.user?.emailVerified ?? false;
              db.collection('users').doc(this.userObject.id).set(this.userObject).then(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const updateProfile = data?.user?.updateProfile({
                  displayName: this.userObject.name,
                });
                const newStoreSettings = this.initDefaultSettings(res.id, data?.user?.uid);
                db.collection('settings').add(newStoreSettings);
              });
            });
          });
      });
  }

  initDefaultSettings(storeId: string, userId?: string): Settings {
    return {
      storeHours: [],
      isAlwaysOpen: false,
      restockWarningThreshold: 30,
      restockDangerThreshold: 10,
      name: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: userId ?? '',
      enabled: true,
      storeId,
      description: '',
    };
  }
}
</script>

<style lang="scss" scoped>
.card-width {
  width: 100%;
  margin: 8px;
}
</style>
