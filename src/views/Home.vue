<template>
  <div class="md-layout full-height md-alignment-center-center">
    <div class="md-layout-item md-small-size-100 md-medium-size-75 md-size-35">
      <form novalidate class="md-layout">
        <md-card class="card-width">
          <md-card-header>
            <div class="md-title">SimpleWonder Inventory</div>
          </md-card-header>
          <md-divider></md-divider>
          <md-card-content>
            <md-field>
              <label>Username</label>
              <md-input></md-input>
            </md-field>
            <md-field>
              <label>Password</label>
              <md-input type="password"></md-input>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-primary">Sign Up</md-button>
            <md-button class="md-accent">Login</md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style lang="scss" scoped>
.card-width {
  width: 100%;
  margin: 8px;
}
</style>
