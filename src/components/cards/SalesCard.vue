<template>
  <v-card class="mx-auto width-100" raised color="#952175" dark>
    <v-card-text>
      <v-btn-toggle
        v-model="salesView"
        mandatory
        dense
        @input="calculateSales()">
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
      Total Sales
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
export default class SalesCard extends Vue {
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
    this.calculateSales();
  }

  get getCalculatedSales() {
    return this.calculateSales();
  }

  calculateSales() {
    switch (this.salesView) {
      case 'today': {
        const todaySale = this.sales.filter((x) => isToday(x.dateSale.toDate()));
        return currency(todaySale.reduce((acc, val) => acc + val.totalSale, 0));
      }
      case 'week': {
        const todaySale = this.sales.filter((x) => isThisWeek(x.dateSale.toDate()));
        return currency(todaySale.reduce((acc, val) => acc + val.totalSale, 0));
      }
      case 'month': {
        const todaySale = this.sales.filter((x) => isThisMonth(x.dateSale.toDate()));
        return currency(todaySale.reduce((acc, val) => acc + val.totalSale, 0));
      }
      default:
        return 0;
    }
  }
}
</script>
