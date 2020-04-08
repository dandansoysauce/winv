<template>
  <div class="md-layout full-height md-alignment-center-center">
    <div class="md-layout-item md-small-size-100 md-medium-size-75 md-size-35">
      <form novalidate class="md-layout">
        <md-card class="card-width">
          <md-card-header>
            <div class="md-title">Sign In - SimpleWonder Inventory</div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <md-field>
              <label>Email</label>
              <md-input v-model="userEmail"></md-input>
            </md-field>
            <md-field>
              <label>Password</label>
              <md-input type="password" v-model="userPassword"></md-input>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-primary" to="/accountcreation">Sign Up</md-button>
            <md-button class="md-accent" @click="loginUser()">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';

@Component
export default class Home extends Vue {
  userEmail: string;

  userPassword: string;

  constructor() {
    super();
    this.userEmail = '';
    this.userPassword = '';
  }

  loginUser(): void {
    if (this.userEmail.length > 0 && this.userPassword.length > 0) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword)
            .then((user) => {
              db.collection('users').doc(user?.user?.uid).get().then((snapshot) => {
                this.$store.dispatch('setUser', snapshot.data()).then(() => {
                  console.log('user set to store');
                });
              });
            });
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.card-width {
  width: 100%;
  margin: 8px;
}
</style>
