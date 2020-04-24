<template>
  <v-card class="mx-auto width-100" raised color="#385F73" dark>
    <v-card-text>
      <v-btn-toggle
        v-model="salesView"
        mandatory
        dense
        @input="calculateProfits()">
        <v-btn value="today">
          <span class="hidden-sm-and-down">Today</span>
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn value="week">
          <span class="hidden-sm-and-down">Week</span>
          <v-icon>mdi-calendar-week</v-icon>
        </v-btn>
        <v-btn value="month">
          <span class="hidden-sm-and-down">Month</span>
          <v-icon>mdi-calendar-month</v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-card-text>
    <v-card-title class="display-3">
      {{ getCalculatedSales }}
    </v-card-title>
    <v-card-subtitle>
      Total Profit
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import currency from 'currency.js';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import User from '@/interfaces/User';
import Sale from '@/interfaces/Sale';

@Component
export default class ProfitsCard extends Vue {
  @Prop()
  sales!: Array<Sale>;

  currentUser: User;

  salesView: string;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.salesView = 'today';
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.calculateProfits();
  }

  get getCalculatedSales() {
    return this.calculateProfits();
  }

  calculateProfits() {
    switch (this.salesView) {
      case 'today': {
        const todaySale = this.sales.filter((x) => isToday(x.dateSale.toDate()));
        const profitSum = todaySale.reduce((acc, val) => acc + (
          val.totalSale - (val.productSupplierPrice * val.quantity)), 0);
        return currency(profitSum);
      }
      case 'week': {
        const todaySale = this.sales.filter((x) => isThisWeek(x.dateSale.toDate()));
        const profitSum = todaySale.reduce((acc, val) => acc + (
          val.totalSale - (val.productSupplierPrice * val.quantity)), 0);
        return currency(profitSum);
      }
      case 'month': {
        const todaySale = this.sales.filter((x) => isThisMonth(x.dateSale.toDate()));
        const profitSum = todaySale.reduce((acc, val) => acc + (
          val.totalSale - (val.productSupplierPrice * val.quantity)), 0);
        return currency(profitSum);
      }
      default:
        return 0;
    }
  }
}
</script>
