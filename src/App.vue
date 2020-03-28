<template>
  <div id="app" class="full-height">
    <router-view/>
  </div>
</template>

<style lang="scss">
html, body {
  height: 100vh;
}

.full-height {
  height: 100%;
}

#app {
  font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
