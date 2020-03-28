<template>
  <div class="full-height">
    <md-app class="full-height" md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button menu"
          @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title toolbar-title">SimpleWonder Inventory / {{ whereAmI }}</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" class="md-elevation-13"
        :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list class="drawer-height">
          <md-list-item to="/dashboard/" @click="changeWhereAmI()" exact>
            <md-icon>dashboard</md-icon>
            <span class="md-list-item-text">Overview</span>
          </md-list-item>
          <md-list-item to="/dashboard/products" @click="changeWhereAmI('Products')">
            <md-icon>ballot</md-icon>
            <span class="md-list-item-text">Products</span>
          </md-list-item>
          <md-list-item to="/dashboard/suppliers" @click="changeWhereAmI('Suppliers')">
            <md-icon>how_to_vote</md-icon>
            <span class="md-list-item-text">Suppliers</span>
          </md-list-item>
          <md-list-item to="/dashboard/users" @click="changeWhereAmI('Users')">
            <md-icon>people</md-icon>
            <span class="md-list-item-text">Users</span>
          </md-list-item>
          <md-list-item to="/dashboard/producttypes" @click="changeWhereAmI('Product Types')">
            <md-icon>notes</md-icon>
            <span class="md-list-item-text">Product Types</span>
          </md-list-item>
          <md-list-item to="/dashboard/sales" @click="changeWhereAmI('Sales')">
            <md-icon>attach_money</md-icon>
            <span class="md-list-item-text">Sales</span>
          </md-list-item>
          <md-list-item to="/dashboard/minipos" @click="changeWhereAmI('Mini Point-of-Sale')">
            <md-icon>devices</md-icon>
            <span class="md-list-item-text">Mini POS</span>
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

      <md-app-content class="content">
        <router-view/>
      </md-app-content>
    </md-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Dashboard extends Vue {
  showNavigation: boolean;

  whereAmI: string;

  constructor() {
    super();
    this.showNavigation = false;
    this.whereAmI = '';
  }

  mounted() {
    this.whereAmI = this.$route.meta.title;
  }

  changeWhereAmI(routeName) {
    this.whereAmI = routeName;
  }
}
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

.menu {
  display: none;
}

.content {
  display: flex;
}

@media (max-width: 600px) {
  .menu {
    display: inline-block;
  }
}
</style>
