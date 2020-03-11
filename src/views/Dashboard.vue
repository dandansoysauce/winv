<template>
  <div class="columns is-flex full-height">
    <div class="column is-flex flex-grow">
      <Header></Header>
      <div class="columns is-mobile">
        <div class="column">
          <p class="bd-notification is-info">First nested column</p>
        </div>
        <div class="column">
          <p class="bd-notification is-info">Second nested column</p>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="container full-height is-fluid">
    <Header></Header>
    <div class="columns dashboard-container is-mobile">
      <div class="column is-two-thirds">
        <article class="panel is-primary">
          <p class="panel-heading">
            Dashboard
          </p>
          <div class="panel-block">

          </div>
        </article>
      </div>
      <div class="column">
        <nav class="panel">
          <p class="panel-heading">
            Overview
          </p>
          <div class="panel-block">

          </div>
        </nav>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';

@Component({
  components: {
    Header,
  },
})
export default class Dashboard extends Vue {}
</script>

<style lang="scss" scoped>
.dashboard-container {
  align-items: stretch;
}

.flex-grow {
  flex-grow: 1;
}
</style>
