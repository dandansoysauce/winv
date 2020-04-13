<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="mx-auto" max-width="600" raised>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4">SimpleWonder Inventory</div>
              <v-list-item-title class="headline mb-1">Sign In</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <ValidationObserver ref="observer">
              <form novalidate autocomplete="off">
                <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                  <v-text-field label="Email" filled v-model="userEmail"
                    prepend-icon="mdi-at" required
                    :error-messages="errors"></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Password" rules="required">
                  <v-text-field label="Password" filled v-model="userPassword"
                    type="password" prepend-icon="mdi-textbox-password"
                    :error-messages="errors"
                    required></v-text-field>
                </ValidationProvider>
              </form>
            </ValidationObserver>
          </v-card-text>

          <v-card-actions class="card-action-padding">
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
export default class Home extends Vue {
  userEmail: string;

  userPassword: string;

  constructor() {
    super();
    this.userEmail = '';
    this.userPassword = '';
  }

  loginUser(): void {
    (this.$refs.observer as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => firebase.auth().signInWithEmailAndPassword(this.userEmail, this.userPassword)
            .then((user) => {
              db.collection('users').doc(user?.user?.uid).get().then((snapshot) => {
                this.$store.dispatch('setUser', snapshot.data()).then(() => {
                  console.log('user set to store');
                });
              });
            }));
      });
  }
}
</script>
