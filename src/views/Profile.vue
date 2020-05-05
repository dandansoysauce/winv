<template>
  <v-card max-width="600" outlined>
    <v-card-title class="headline" primary-title>
      Profile
    </v-card-title>
    <v-card-text v-if="currentUser" style="max-height: 600px;">
      <v-btn v-if="!currentUser.emailVerified" class="mb-4" outlined large
        @click="verifyEmail()">Verify Email</v-btn>
      <ValidationObserver ref="profileObserver">
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
        <div class="d-flex flex-row mb-4">
          <v-btn outlined large @click="saveProfile()">Save Profile</v-btn>
        </div>
      </ValidationObserver>
      <v-divider></v-divider>
      <p class="subtitle-2 mt-4">Change Password</p>
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
        <ValidationProvider v-slot="{ errors }" name="Old Password" rules="required">
          <v-text-field label="Old Password" filled v-model="oldPassword"
            :error-messages="errors" required
            type="password"></v-text-field>
        </ValidationProvider>
        <div class="d-flex flex-row mb-4">
          <v-btn outlined large @click="changePassword()">Change Password</v-btn>
        </div>
      </ValidationObserver>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import * as firebase from 'firebase/app';
import { db } from '@/main';
import User from '@/interfaces/User';
import {
  required, email, confirmed, min,
} from 'vee-validate/dist/rules';
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
export default class Profile extends Vue {
  currentUser: User;

  password: string;

  confirmPassword: string;

  oldPassword: string;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.password = '';
    this.confirmPassword = '';
    this.oldPassword = '';
  }

  saveProfile() {
    (this.$refs.profileObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        const user = firebase.auth().currentUser;
        if (user) {
          user.updateProfile({ displayName: this.currentUser.name });
          user.updateEmail(this.currentUser.email);
          db.collection('users').doc(user.uid).update({
            phoneNumber: this.currentUser.phoneNumber,
            name: this.currentUser.name,
            email: this.currentUser.email,
          });
        }
      });
  }

  changePassword() {
    (this.$refs.profileObserver as Vue & { validate: () => Promise<boolean> })
      .validate().then((success) => {
        if (!success) return;

        const user = firebase.auth().currentUser;
        if (user) {
          const cred = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, this.oldPassword);
          user.reauthenticateWithCredential(cred).then(() => {
            user.updatePassword(this.password);
          });
        }
      });
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
