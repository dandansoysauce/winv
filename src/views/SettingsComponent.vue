<template>
  <v-card max-width="600" outlined>
    <v-card-title class="headline" primary-title>
      Settings
    </v-card-title>
    <v-card-text style="max-height: 600px;">
      <ValidationProvider v-slot="{ errors }" name="Restock Warning" rules="required|min_value:1">
        <v-text-field label="Restock Warning" filled v-model="settings.restockWarningThreshold"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="Restock Danger" rules="required|min_value:1">
        <v-text-field label="Restock Danger" filled v-model="settings.restockDangerThreshold"
          :error-messages="errors" required></v-text-field>
      </ValidationProvider>
    </v-card-text>
    <v-card-actions class="card-action-padding">
      <v-btn text @click="closeDialog()">Close</v-btn>
      <v-btn color="primary" depressed width="120" @click="saveSettings()">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import Settings from '@/interfaces/Settings';
import User from '@/interfaces/User';
import { required, min_value as minValue } from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');
extend('required', {
  ...required,
  message: '{_field_} is required',
});
extend('min_value', {
  ...minValue,
  message: '{_field_} should be at least {min}',
});

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },
})
export default class SettingsComponent extends Vue {
  settings: Settings;

  currentUser: User;

  constructor() {
    super();
    this.settings = {} as Settings;
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    if (this.currentUser) {
      db.collection('settings')
        .where('storeId', '==', this.currentUser.storeId).get().then((snapshot) => {
          snapshot.forEach((doc) => {
            const myId = 'id';
            this.settings = doc.data() as Settings;
            this.settings[myId] = doc.id;
            this.$store.dispatch('saveSettings', this.settings);
          });
        });
    }
  }

  saveSettings() {
    db.collection('settings').doc(this.settings.id).set(this.settings).then(() => {
      this.$store.dispatch('saveSettings', this.settings);
    });
  }

  initDefaultSettings(): Settings {
    return {
      storeHours: [],
      isAlwaysOpen: false,
      restockWarningThreshold: 30,
      restockDangerThreshold: 10,
      name: '',
      modifiedAt: firebase.firestore.Timestamp.fromDate(new Date()),
      createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      modifiedBy: this.currentUser.id ?? '',
      enabled: true,
      storeId: this.currentUser.storeId,
      description: '',
    };
  }
}
</script>
