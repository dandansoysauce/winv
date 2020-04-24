<template>
  <v-card class="mx-auto width-100" raised>
    <v-card-text>
      <v-btn-toggle
        v-model="salesView"
        mandatory
        dense
        @input="calculateNumberOfSales()">
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
      # of Sales
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { isToday, isThisWeek, isThisMonth } from 'date-fns';
import User from '@/interfaces/User';
import Sale from '@/interfaces/Sale';

@Component
export default class TotalSalesCard extends Vue {
  @Prop()
  sales!: Array<Sale>;

  currentUser: User;

  salesView: string;

  numberOfSales: number;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.salesView = 'today';
    this.numberOfSales = 0;
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.calculateNumberOfSales();
  }

  get getCalculatedSales() {
    return this.calculateNumberOfSales();
  }

  calculateNumberOfSales() {
    switch (this.salesView) {
      case 'today': {
        return this.sales.filter((x) => isToday(x.dateSale.toDate())).length;
      }
      case 'week': {
        return this.sales.filter((x) => isThisWeek(x.dateSale.toDate())).length;
      }
      case 'month': {
        return this.sales.filter((x) => isThisMonth(x.dateSale.toDate())).length;
      }
      default:
        return 0;
    }
  }
}
</script>
