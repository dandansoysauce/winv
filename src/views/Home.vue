<template>
  <b-container class="h-100 w-25">
    <b-row class="h-100">
      <b-col align-self="center">
        <b-card title="SimpleWonder Inventory">
          <b-form>
            <b-form-group label="Username" label-align="left">
              <b-form-input type="text" required></b-form-input>
            </b-form-group>
            <b-form-group label="Password" label-align="left">
              <b-form-input type="password" required></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary" class="w-100">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>

<style lang="scss" scoped>
.card-width {
  width: 35%;
  margin: 0 auto;
  text-align: left;
}
</style>
