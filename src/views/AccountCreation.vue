<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="600" raised dark>
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
                    <v-text-field label="Name" filled v-model="userObject.name"
                      prepend-icon="mdi-textbox"></v-text-field>
                    <v-text-field label="Email" filled v-model="userObject.email"
                      prepend-icon="mdi-at"></v-text-field>
                    <v-text-field label="Phone Number" filled
                      v-model="userObject.phoneNumber" prepend-icon="mdi-cellphone"></v-text-field>
                    <v-text-field label="Password" filled
                      v-model="userObject.password"
                      prepend-icon="mdi-textbox-password"></v-text-field>
                    <v-text-field label="Confirm Password" filled
                      v-model="confirmPassword"
                      prepend-icon="mdi-textbox-password"></v-text-field>

                    <v-btn depressed to="/" class="mr-2">Cancel</v-btn>
                    <v-btn depressed color="primary" @click="continueStep(2)"
                      width="160">Continue</v-btn>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-text-field label="Name" filled
                      v-model="storeObject.storeName"
                      prepend-icon="mdi-textbox"></v-text-field>
                    <v-textarea label="Address" filled
                      v-model="storeObject.storeAddress"
                      prepend-icon="mdi-map-marker"></v-textarea>

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
  <!-- <div class="md-layout full-height md-alignment-center-center">
    <div class="md-layout-item md-small-size-100 md-medium-size-75 md-size-45">
      <form novalidate class="md-layout">
        <md-card class="card-width">
          <md-card-header>
            <div class="md-title">Create An Account - SimpleWonder Inventory</div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <md-steppers :md-active-step.sync="active" md-linear>
              <md-step id="basicInfo" md-label="Basic Information" md-description="About You"
                :md-done.sync="basicInfo">
                <md-field>
                  <label>Name</label>
                  <md-input v-model="userObject.name" required></md-input>
                </md-field>
                <md-field>
                  <label>Email</label>
                  <md-input v-model="userObject.email" required></md-input>
                </md-field>
                <md-field>
                  <label>Phone Number</label>
                  <md-input v-model="userObject.phoneNumber"></md-input>
                </md-field>
                <md-field>
                  <label>Password</label>
                  <md-input v-model="userObject.password" type="password" required></md-input>
                </md-field>
                <md-field>
                  <label>Confirm Password</label>
                  <md-input v-model="confirmPassword" type="password" required></md-input>
                </md-field>
                <md-button class="md-raised md-primary margin-0"
                  @click="continueStep()">Continue</md-button>
              </md-step>
              <md-step id="storeInfo" md-label="Store Information" md-description="Store/Company"
                :md-done.sync="storeInfo">
                <md-field>
                  <label>Store Name</label>
                  <md-input v-model="storeObject.storeName" required></md-input>
                </md-field>
                <md-field>
                  <label>Address</label>
                  <md-textarea v-model="storeObject.storeAddress" required></md-textarea>
                </md-field>
                <md-button class="md-raised md-primary margin-0"
                  @click="registerAccount()">Done</md-button>
              </md-step>
            </md-steppers>
          </md-card-content>
        </md-card>
      </form>
    </div>
  </div> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import User from '@/interfaces/User';
import Store from '@/interfaces/Store';
import uniqid from 'uniqid';

@Component
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
      createdAt: new Date(),
      modifiedAt: new Date(),
      emailVerified: false,
    };
    this.storeObject = {
      storeName: '',
      storeAddress: '',
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    this.confirmPassword = '';
  }

  created() {
    console.log(this.$route.params.inviteCode);
  }

  continueStep(step: number) {
    this.active = step;
  }

  registerAccount() {
    firebase.auth().createUserWithEmailAndPassword(this.userObject.email, this.userObject.password ?? '')
      .then((data) => {
        this.storeObject.createdAt = new Date();
        this.storeObject.modifiedAt = new Date();
        this.storeObject.inviteCode = uniqid();
        db.collection('stores').add(this.storeObject).then((res) => {
          delete this.userObject.password;
          this.userObject.id = data?.user?.uid;
          this.userObject.createdAt = new Date();
          this.userObject.modifiedAt = new Date();
          this.userObject.storeId = res.id;
          this.userObject.emailVerified = data?.user?.emailVerified ?? false;
          db.collection('users').doc(this.userObject.id).set(this.userObject).then(() => {
            const updateProfile = data?.user?.updateProfile({
              displayName: this.userObject.name,
            });
            console.log('profile updated', updateProfile);
          });
        });
      }).catch((err) => {
        console.log(err);
      });
  }
}
</script>

<style lang="scss" scoped>
.card-width {
  width: 100%;
  margin: 8px;
}
</style>
