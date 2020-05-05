<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col class="d-flex flex-column">
        <v-card class="mx-auto" width="600" max-width="600" raised>
          <v-list-item two-line>
            <v-list-item-content>
              <div class="overline mb-4"><b>An email will be sent for password reset.</b></div>
              <v-list-item-title class="headline mb-1">Password Reset</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text>
            <ValidationObserver ref="observer">
              <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
                <v-text-field label="Email" filled v-model="emailAddress"
                  prepend-icon="mdi-at" required
                  :error-messages="errors"></v-text-field>
              </ValidationProvider>
            </ValidationObserver>
          </v-card-text>

          <v-card-actions class="card-action-padding">
            <v-btn color="primary" depressed large @click="sendResetLink()">Reset Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
export default class ForgotPassword extends Vue {
  emailAddress: string;

  constructor() {
    super();
    this.emailAddress = '';
  }

  sendResetLink() {
    firebase.auth().sendPasswordResetEmail(this.emailAddress);
  }
}
</script>
