<template>
  <v-card class="mx-auto" raised>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ productInfo.name }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ productInfo.description.length > 0 ? productInfo.description
            : 'No Description' }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-row align="center">
      <v-col cols="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>{{ productInfo.quantity }} pcs</v-list-item-subtitle>
        </v-list-item>
      </v-col>
      <v-col cols="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-cash</v-icon>
          </v-list-item-icon>
          <v-list-item-subtitle>{{ productInfo.salePrice }} ea.</v-list-item-subtitle>
        </v-list-item>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-btn text>
        View
      </v-btn>
      <v-btn depressed @click="editProduct(productInfo)">
        Edit
      </v-btn>
      <v-btn color="pink" depressed dark
        @click="restockProduct(productInfo)">
        Restock
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Product from '@/interfaces/Product';

@Component
export default class ProductCard extends Vue {
  @Prop() private productInfo!: Product;

  @Prop() private productObject!: Product;

  @Prop() private dialogMode!: string;

  @Prop() private showDialog!: boolean;

  editProduct(product: Product) {
    this.$emit('update:dialogMode', 'edit');
    this.$emit('update:showDialog', true);
    this.$emit('update:productObject', product);
  }
}
</script>
