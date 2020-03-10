<template>
  <div class="container is-fluid">
    <Header></Header>
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
</style>
