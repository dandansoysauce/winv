<template>
  <v-card class="mx-auto" raised>
    <v-card-title
      class="headline grey lighten-2" primary-title>
      Recent Sales List
    </v-card-title>
    <v-card-text>
      <v-list max-height="400" class="overflow-y-auto">
        <v-subheader>Last 20 Sales</v-subheader>
        <v-list-item v-for="sale in lastTwentySales" :key="sale.id" two-line>
          <v-list-item-content>
            <v-list-item-title>{{ sale.productName }}</v-list-item-title>
            <v-list-item-subtitle>
              Total: {{ sale.totalSale }} | Quantity: {{ sale.quantity }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import User from '@/interfaces/User';
import Sale from '@/interfaces/Sale';

@Component
export default class RecentSalesCard extends Vue {
  @Prop()
  sales!: Array<Sale>;

  currentUser: User;

  constructor() {
    super();
    this.currentUser = {} as User;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
  }

  get lastTwentySales() {
    return this.sales.slice(0, 20);
  }
}
</script>
