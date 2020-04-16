<template>
  <v-card class="fill-height mx-auto text-center" raised
    color="green" dark>
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :value="getQuantityProducts"
          :labels="getLabelsFromDates"
          color="rgba(255, 255, 255, .7)"
          height="100"
          padding="24"
          stroke-linecap="round"
          smooth
        >
        </v-sparkline>
      </v-sheet>
    </v-card-text>
    <v-card-text>
      <div class="display-1 font-weight-thin">Products Sold Last 24 hrs</div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="justify-center">
      <v-btn block text>Go to Charts</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import {
  isToday, setHours, setMinutes, setSeconds, format, isSameHour,
} from 'date-fns';
import User from '@/interfaces/User';
import Sale from '@/interfaces/Sale';

@Component
export default class ProductsSoldChartCard extends Vue {
  @Prop()
  sales!: Array<Sale>;

  dates: Date[];

  currentUser: User;

  constructor() {
    super();
    this.currentUser = {} as User;
    this.dates = [
      setHours(setMinutes(setSeconds(Date.now(), 0), 0), 8),
      setHours(setMinutes(setSeconds(Date.now(), 0), 0), 10),
      setHours(setMinutes(setSeconds(Date.now(), 0), 0), 12),
      setHours(setMinutes(setSeconds(Date.now(), 0), 0), 14),
      setHours(setMinutes(setSeconds(Date.now(), 0), 0), 16),
    ];
  }

  created() {
    this.currentUser = this.$store.state.currentUser;
    this.mapProductsQuantity();
  }

  get getQuantityProducts() {
    return this.mapProductsQuantity();
  }

  get getLabelsFromDates() {
    return this.dates.map((x) => format(x, 'hh a'));
  }

  mapProductsQuantity() {
    const salesToday = this.sales.filter((x) => isToday(x.dateSale.toDate()));
    return this.dates.map((date) => {
      const filterToday = salesToday.filter((saleDate) => isSameHour(
        date, saleDate.dateSale.toDate(),
      ));
      return Number(filterToday.reduce((acc, val) => acc + val.quantity, 0));
    });
  }
}
</script>
