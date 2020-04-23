<template>
  <div class="full-height">
    <h2>Stock Alerts</h2>
    <div class="full-height overflow-y-auto">
      <v-card v-for="danger in dangerProducts" :key="danger.id"
        class="mx-auto ma-2"
        color="red"
        outlined>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ danger.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ danger.quantity }} in stock
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card v-for="warning in warnProducts" :key="warning.id"
        class="mx-auto ma-2"
        color="orange"
        outlined>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="headline">{{ warning.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ warning.quantity }} in stock
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { db } from '@/main';
import * as firebase from 'firebase/app';
import Product from '@/interfaces/Product';
import Settings from '@/interfaces/Settings';

@Component
export default class RestockAlerts extends Vue {
  @Prop() products!: Product[];

  warnProducts: Product[];

  dangerProducts: Product[];

  storeSettings: Settings;

  warningStock: number;

  dangerStock: number;

  constructor() {
    super();
    this.storeSettings = {} as Settings;
    this.warnProducts = [];
    this.dangerProducts = [];
    this.warningStock = 0;
    this.dangerStock = 0;
  }

  created() {
    this.setStockAlerts(this.products);
  }

  @Watch('products')
  onProductsChanged(value: Product[]) {
    this.setStockAlerts(value);
  }

  setStockAlerts(products: Product[]) {
    this.storeSettings = this.$store.state.settings as Settings;
    if (this.storeSettings) {
      this.warningStock = Number(this.storeSettings.restockWarningThreshold);
      this.dangerStock = Number(this.storeSettings.restockDangerThreshold);

      this.warnProducts = products.filter((x) => x.quantity > this.dangerStock && x.quantity <= this.warningStock);
      this.dangerProducts = products.filter((x) => x.quantity > 0 && x.quantity <= this.dangerStock);
    }
  }
}
</script>
