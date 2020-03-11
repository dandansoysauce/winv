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
