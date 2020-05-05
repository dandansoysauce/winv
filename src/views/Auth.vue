<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col class="d-flex flex-column">
        <v-card class="mx-auto" width="600" max-width="600" raised>
          <v-card-title class="headline" primary-title>
            SimpleWonder IMS
          </v-card-title>
          <v-card-text>
            <h2>{{ message }}</h2>
            <p>{{ subtitleMessage }}</p>
            <div v-if="actionMode === 'resetPassword'">
              <ValidationObserver ref="passwordObserver">
                <ValidationProvider v-slot="{ errors }" name="New Password"
                  rules="required|confirmed:confirmation|min:8">
                  <v-text-field label="New Password" filled v-model="password"
                    :error-messages="errors" required
                    type="password"></v-text-field>
                </ValidationProvider>
                <ValidationProvider v-slot="{ errors }" name="Confirm Password" rules="required"
                  vid="confirmation">
                  <v-text-field label="Confirm Password" filled v-model="confirmPassword"
                    :error-messages="errors" required
                    type="password"></v-text-field>
                </ValidationProvider>
              </ValidationObserver>
            </div>
          </v-card-text>
          <v-card-actions class="card-action-padding" v-if="actionMode === 'resetPassword'">
            <v-btn outlined large link to="/dashboard/home">Go to Dashboard</v-btn>
            <v-btn color="primary" depressed large @click="changePassword()">Change Password</v-btn>
          </v-card-actions>
          <v-card-actions class="card-action-padding" v-if="actionMode === 'verifyEmail'">
            <v-btn outlined large link to="/dashboard/home">Go to Dashboard</v-btn>
            <v-btn color="primary" depressed large @click="resendVerification()">Resend Verification</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import { db } from '@/main';
import User from '@/interfaces/User';
import {
  required, confirmed, min,
} from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');
extend('required', {
  ...required,
  message: '{_field_} is required',
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
export default class Auth extends Vue {
  message: string;

  subtitleMessage: string;

  actionMode: string;

  currentUser: User;

  password: string;

  confirmPassword: string;

  constructor() {
    super();
    this.message = '';
    this.subtitleMessage = '';
    this.actionMode = '';
    this.password = '';
    this.confirmPassword = '';
    this.currentUser = {} as User;
  }

  created() {
    const mode = this.$route.query.mode as string;
    this.actionMode = mode;
    const oobCode = this.$route.query.oobCode as string;
    switch (mode) {
      case 'verifyEmail': {
        this.verifyEmail(oobCode);
        break;
      }
      case 'resetPassword': {
        this.message = 'Password Reset';
        this.subtitleMessage = 'Enter your new password.';
        break;
      }
      default:
        break;
    }
    this.currentUser = this.currentUserStore;
  }

  changePassword() {
    const code = this.$route.query.oobCode as string;
    firebase.auth().verifyPasswordResetCode(code).then(() => {
      firebase.auth().confirmPasswordReset(code, this.password).then(() => {
        this.$router.push({ name: 'Home' });
      });
    }).catch(() => {
      this.message = 'Password Reset Unsuccessful.';
      this.subtitleMessage = 'Code is either invalid or expired.';
    });
  }

  verifyEmail(code: string) {
    firebase.auth().applyActionCode(code).then(() => {
      this.message = 'Email Verified';
      this.subtitleMessage = 'Your email has been verified.';
      const user = firebase.auth().currentUser;
      if (user) {
        db.collection('users').doc(user.uid).update({ emailVerified: user.emailVerified });
      }
    }).catch(() => {
      this.message = 'Email Verification Unsuccessful.';
      this.subtitleMessage = 'Code is either invalid or expired.';
    });
  }

  resendVerification() {
    if (this.currentUser && this.currentUser.email) {
      const user = firebase.auth().currentUser;
      if (user) {
        user.sendEmailVerification();
      }
    }
  }

  get currentUserStore(): User {
    return this.$store.state.currentUser;
  }

  @Watch('currentUserStore')
  onCurrentUserChanged(value: User) {
    this.currentUser = value;
  }
}
</script>
