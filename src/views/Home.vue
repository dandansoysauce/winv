<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="600" raised dark>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4">SimpleWonder Inventory</div>
              <v-list-item-title class="headline mb-1">Sign In</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <form novalidate autocomplete="off">
              <v-text-field label="Email" filled v-model="userEmail"
                prepend-icon="mdi-at"></v-text-field>
              <v-text-field label="Password" filled v-model="userPassword"
                type="password" prepend-icon="mdi-textbox-password"></v-text-field>
            </form>
          </v-card-text>

          <v-card-actions class="login-action-padding">
            <v-btn depressed to="/accountcreation">Sign Up</v-btn>
            <v-btn depressed color="primary" @click="loginUser()" width="160">Enter</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
        .then(() => firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword)
          .then((user) => {
            db.collection('users').doc(user?.user?.uid).get().then((snapshot) => {
              this.$store.dispatch('setUser', snapshot.data()).then(() => {
                console.log('user set to store');
              });
            });
          }));
    }
  }
}
</script>

<style lang="scss" scoped>
.login-action-padding {
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
}
</style>
