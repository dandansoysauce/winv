<template>
  <div class="container flex flex-column">
    <md-dialog :md-active.sync="showDialog" class="dialog-size">
      <md-dialog-title>Add New Product Type</md-dialog-title>
      <md-dialog-content>
        <form novalidate class="md-layout">
          <div class="md-layout">
            <md-field>
              <label>Name</label>
              <md-input v-model="initial"></md-input>
            </md-field>
            <md-field>
              <label>Description</label>
              <md-textarea v-model="initial"></md-textarea>
            </md-field>
            <div class="md-layout">
              <div class="md-layout-item md-size-15">
                <h5>Properties</h5>
              </div>
              <div class="md-layout-item text-align-right">
                <md-button class="md-fab md-accent">
                  <md-icon>add</md-icon>
                </md-button>
              </div>
            </div>
          </div>
        </form>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showDialog = false">Close</md-button>
        <md-button class="md-raised md-primary" @click="showDialog = false">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="md-layout flex-1">
      <div class="md-layout-item md-large-size-100 md-xlarge-size-35">
        <md-button class="md-raised md-accent add-button-margin"
          @click="showDialog = true">Add New</md-button>
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
export default class DashboardProductTypes extends Vue {
  showDialog: boolean;

  constructor() {
    super();
    this.showDialog = false;
  }
}
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

.dialog-size {
  width: 600px;
  height: 650px;
  max-height: 650px;
}
</style>
