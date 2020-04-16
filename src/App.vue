<template>
  <v-app id="app" class="full-height">
    <router-view/>
  </v-app>
</template>

<style lang="scss">
html, body {
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.full-height {
  height: 100%;
}

.max-height {
  max-height: 100%;
}

.with-button-container {
  height: calc(100% - 48px);
}

.with-tab-container {
  height: calc(100% - 69px);
}

.inner-tab-container {
  height: calc(100% - 50px);
}

.cards-container {
  height: calc(100% - 84px);
}

.sale-container {
  height: calc(100% - 60px);
}

#app {
  font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.card-action-padding {
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
}

.flex {
  display: flex;
}

.flex-1 {
  flex: 1;
}

.flex-column {
  flex-direction: column;
}

.flex-row {
  flex-direction: row;
}

.flex-items-center {
  align-items: center;
}

.text-align-right {
  text-align: right;
}

.float-right {
  float: right;
}

.width-100 {
  width: 100%;
}

.margin-0 {
  margin: 0 !important;
}

.margin-top-16 {
  margin-top: 16px !important;
}

.margin-left-16 {
  margin-left: 16px !important;
}

.padding-all-24 {
  padding: 24 !important;
}

.padding-right-16 {
  padding-right: 16px !important;
}

.padding-left-16 {
  padding-left: 16px !important;
}

.dialog-size {
  width: 600px;
  height: 650px;
  max-height: 650px;
}

.dialog-save-button {
  width: 200px;
}

.dialog-cancel-button {
  width: 60px;
}

.dialog-buttons {
  height: 60px;
}
</style>
