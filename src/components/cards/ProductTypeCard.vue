<template>
  <v-card class="mx-auto" raised>
    <v-card-title>
      {{ productTypeInfo.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ productTypeInfo.description.length > 0 ? productTypeInfo.description : 'No Description' }}
    </v-card-subtitle>
    <v-card-actions>
      <v-btn text>
        View
      </v-btn>
      <v-btn color="primary" depressed @click="editProductType(productTypeInfo)">
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProductType from '@/interfaces/ProductType';

@Component
export default class ProductTypeCard extends Vue {
  @Prop() private productTypeInfo!: ProductType;

  @Prop() private productTypeObject!: ProductType;

  @Prop() private dialogMode!: string;

  @Prop() private showDialog!: boolean;

  editProductType(productType: ProductType) {
    this.$emit('update:dialogMode', 'edit');
    this.$emit('update:showDialog', true);
    this.$emit('update:productTypeObject', productType);
  }
}
</script>
