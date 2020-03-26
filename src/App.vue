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
