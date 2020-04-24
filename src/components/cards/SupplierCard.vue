<template>
  <v-card class="mx-auto width-100" raised>
    <v-card-title>
      {{ supplierInfo.name }}
    </v-card-title>
    <v-card-subtitle>
      {{ supplierInfo.description.length > 0 ? supplierInfo.description : 'No Description' }}
    </v-card-subtitle>
    <v-card-actions>
      <v-btn text>
        View
      </v-btn>
      <v-btn color="primary" depressed @click="editSupplier(supplierInfo)">
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Supplier from '@/interfaces/Supplier';

@Component
export default class SupplierCard extends Vue {
  @Prop() private supplierInfo!: Supplier;

  @Prop() private supplierObject!: Supplier;

  @Prop() private dialogMode!: string;

  @Prop() private showDialog!: boolean;

  editSupplier(supplier: Supplier) {
    this.$emit('update:dialogMode', 'edit');
    this.$emit('update:showDialog', true);
    this.$emit('update:supplierObject', supplier);
  }
}
</script>
