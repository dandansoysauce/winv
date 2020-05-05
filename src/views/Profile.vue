<template>
  <v-card max-width="600" outlined>
    <v-card-title class="headline" primary-title>
      Profile
    </v-card-title>
    <v-card-text v-if="currentUser" style="max-height: 600px;">
      <v-btn v-if="!currentUser.emailVerified" class="mb-4" outlined large
        @click="verifyEmail()">Verify Email</v-btn>
      <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email">
        <v-text-field label="Email" filled v-model="currentUser.email"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="Name" rules="required">
        <v-text-field label="Name" filled v-model="currentUser.name"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="Phone Number" rules="required">
        <v-text-field label="Phone Number" filled v-model="currentUser.phoneNumber"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <p class="subtitle-2 mt-4">Change Password</p>
      <ValidationProvider v-slot="{ errors }" name="New Password" rules="required">
        <v-text-field label="New Password" filled v-model="currentUser.password"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="Confirm Password" rules="required">
        <v-text-field label="Confirm Password" filled v-model="confirmPassword"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="Old Password" rules="required">
        <v-text-field label="Old Password" filled v-model="oldPassword"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
    </v-card-text>
    <v-card-actions class="card-action-padding">
      <v-btn text>Close</v-btn>
      <v-btn color="primary" depressed width="120" @click="saveProfile()">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import User from '@/interfaces/User';
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
export default class Profile extends Vue {
  currentUser: User;

  confirmPassword: string;

  oldPassword: string;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.confirmPassword = '';
    this.oldPassword = '';
  }

  verifyEmail() {
    if (this.currentUser && this.currentUser.email) {
      const user = firebase.auth().currentUser;
      if (user) {
        user.sendEmailVerification();
      }
    }
  }

  created() {
    this.currentUser = this.currentUserStore;
  }

  get currentUserStore() {
    return this.$store.state.currentUser;
  }

  @Watch('currentUserStore')
  onCurrentUserChanged(value: User) {
    this.currentUser = value;
  }
}
</script>
