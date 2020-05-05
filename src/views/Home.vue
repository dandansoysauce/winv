<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col class="d-flex flex-column">
        <v-card class="mx-auto" width="600" max-width="600" raised>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4"><b>SimpleWonder Inventory v1.2.0BETA</b></div>
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
            <v-btn depressed color="primary" @click="loginUser()" width="160">Login</v-btn>
            <v-divider class="mt-4"></v-divider>
            <div class="d-flex flex-row">
              <v-btn class="mt-4" outlined large to="/accountcreation">Sign Up</v-btn>
              <v-btn class="mt-4 ml-3" depressed large to="/forgotpassword">Forgot Password</v-btn>
            </div>
          </v-card-text>
        </v-card>
        <div class="mt-3 mx-auto flex-row">
          <v-btn href="https://www.buymeacoffee.com/WLmhc53q0" color="warning" dark
            target="_blank">
            <img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" height="24"
              alt="Buy me a coffee" style="margin-right: 15px;">
            Buy me a coffee
          </v-btn>
          <v-btn class="ml-4" href="https://www.patreon.com/bePatron?u=33573268" color="error" dark
            target="_blank">
            <v-icon style="margin-right: 15px;">mdi-patreon</v-icon>
            Become a Patron
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import User from '@/interfaces/User';
import Settings from '@/interfaces/Settings';
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
                const userData = snapshot.data() as User;
                this.$store.dispatch('setUser', userData);
                db.collection('settings')
                  .where('storeId', '==', userData.storeId).get().then((settingsSnap) => {
                    settingsSnap.forEach((doc) => {
                      const myId = 'id';
                      const settings = doc.data() as Settings;
                      settings[myId] = doc.id;
                      this.$store.dispatch('saveSettings', settings);
                    });
                  });
              });
            }));
      });
  }
}
</script>
