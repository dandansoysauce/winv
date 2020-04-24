<template>
  <v-card class="mx-auto width-100" raised color="#385F73" dark>
    <v-card-title class="display-3">
      {{ calcNumberProducts }}
    </v-card-title>
    <v-card-subtitle>
      Number of Products In Stock
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Product from '@/interfaces/Product';

@Component
export default class NumberProductsCard extends Vue {
  @Prop() products!: Product[];

  get calcNumberProducts() {
    return this.products.reduce((acc, val) => acc + Number(val.quantity), 0);
  }
}
</script>
