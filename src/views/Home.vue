<template>
  <div class="columns is-vcentered full-height is-centered">
    <div class="column">
      <div class="card card-width">
        <header class="card-header">
          <p class="card-header-title">
            WINV
          </p>
        </header>
        <div class="card-content">
          <div class="content">
            <section>
              <b-field label="Username">
                <b-input value="Kevin Garvey"></b-input>
              </b-field>
              <b-field label="Password">
                <b-input type="password" value="Kevin Garvey"></b-input>
              </b-field>
            </section>
          </div>
        </div>
        <footer class="card-footer">
          <a href="#" class="card-footer-item">Login</a>
        </footer>
      </div>
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
  width: 35%;
  margin: 0 auto;
  text-align: left;
}
</style>
