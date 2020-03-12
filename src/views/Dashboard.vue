<template>
  <div class="full-height">
    <md-app class="full-height" md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <span class="md-title toolbar-title">My Inventory</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-elevation-13">
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list class="drawer-height">
          <md-list-item to="/dashboard/" exact>
            <md-icon>dashboard</md-icon>
            <span class="md-list-item-text">Overview</span>
          </md-list-item>
          <md-list-item to="/dashboard/products">
            <md-icon>ballot</md-icon>
            <span class="md-list-item-text">Products</span>
          </md-list-item>
          <md-list-item to="/dashboard/suppliers">
            <md-icon>how_to_vote</md-icon>
            <span class="md-list-item-text">Suppliers</span>
          </md-list-item>
          <md-list-item to="/dashboard/users">
            <md-icon>people</md-icon>
            <span class="md-list-item-text">Users</span>
          </md-list-item>
          <md-list-item to="/dashboard/producttypes">
            <md-icon>notes</md-icon>
            <span class="md-list-item-text">Product Types</span>
          </md-list-item>
          <md-list-item to="/dashboard/sales">
            <md-icon>attach_money</md-icon>
            <span class="md-list-item-text">Sales</span>
          </md-list-item>

          <md-subheader>Me</md-subheader>
          <md-list-item>
            <md-icon>face</md-icon>
            <span class="md-list-item-text">Profile</span>
          </md-list-item>
          <md-list-item>
            <md-icon>exit_to_app</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>

          <md-divider class="divider-item"></md-divider>

          <md-list-item class="settings-item">
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">Settings</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Dashboard extends Vue {}
</script>

<style lang="scss" scoped>
.drawer-height {
  height: calc(100% - 64px);
}

.settings-item {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.divider-item {
  position: absolute;
  bottom: 48px;
  left: 0;
  right: 0;
}

.toolbar-title {
  flex: 1;
}
</style>
