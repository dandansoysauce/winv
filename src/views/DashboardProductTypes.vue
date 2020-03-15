<template>
  <div class="container flex flex-column">
    <div class="md-layout flex-1">
      <div class="md-layout-item md-large-size-100 md-xlarge-size-35">
        <md-button class="md-raised md-accent add-button-margin">Add New</md-button>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-100">
            <md-card class="md-elevation-13 add-card-margin-top">
              <md-card-content>
                <span class="md-display-2">3 types</span>
                <p class="md-subheading">Active Product Types</p>
              </md-card-content>
            </md-card>
          </div>
          <div class="md-layout-item md-size-100">
            <md-card class="md-elevation-13 add-card-margin-top">
              <md-card-header>
                <div class="md-title">Usage</div>
              </md-card-header>
              <md-card-content>
                <span class="md-subheading">Product Types Used In</span>
              </md-card-content>
            </md-card>
          </div>
          <div class="md-layout-item md-size-100"></div>
        </div>
      </div>
      <div class="md-layout-item md-large-size-100 md-xlarge-size-65">
        <md-list>
          <md-subheader>Product Types</md-subheader>
          <md-list-item>
            <md-avatar>
              <img src="https://placeimg.com/40/40/people/5" alt="People">
            </md-avatar>

            <span class="md-list-item-text">Abbey Christansen</span>

            <md-button class="md-icon-button md-list-action">
              <md-icon class="md-primary">chat_bubble</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DashboardProductTypes extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  flex: 1;
}

.list-container {
  position: absolute;
  top: 153px;
  bottom: 10px;
  right: 6px;
  left: 35%;
  overflow: auto;
}

.add-button-margin {
  margin-left: 16px;
}

.add-card-margin-top {
  margin-top: 22px;
}
</style>
