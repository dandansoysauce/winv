<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DashboardHome extends Vue {
  created() {
    console.log(this.$store.state.currentUser);
  }
}
</script>
