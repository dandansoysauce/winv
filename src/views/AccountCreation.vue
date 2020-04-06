<template>
  <div class="md-layout full-height md-alignment-center-center">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import User from '@/interfaces/User';
import Store from '@/interfaces/Store';

@Component
export default class AccountCreation extends Vue {
  active: string;

  basicInfo: boolean;

  storeInfo: boolean;

  userObject: User;

  storeObject: Store;

  confirmPassword: string;

  constructor() {
    super();
    this.active = 'basicInfo';
    this.basicInfo = false;
    this.storeInfo = false;
    this.userObject = {
      name: '',
      email: '',
      password: '',
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    this.storeObject = {
      storeName: '',
      storeAddress: '',
      dateCreated: new Date(),
      dateModified: new Date(),
    };
    this.confirmPassword = '';
  }

  continueStep() {
    this.basicInfo = true;
    this.active = 'storeInfo';
  }

  registerAccount() {
    console.log('register my account');
  }
}
</script>

<style lang="scss" scoped>
.card-width {
  width: 100%;
  margin: 8px;
}
</style>
