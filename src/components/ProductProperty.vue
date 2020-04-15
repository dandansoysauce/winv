<template>
  <div>
    <v-text-field :label="productProperty.name" filled v-model="productProperty.value" type="text"
      v-if="inputType === 'Text'" @input="emitValue()"></v-text-field>
    <v-text-field :label="productProperty.name" filled v-model="productProperty.value" type="number"
      v-if="inputType === 'Number'" @input="emitValue()"></v-text-field>
    <v-menu
      v-model="productProperty.menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      v-if="inputType === 'Date'"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="productProperty.value"
          :label="productProperty.name"
          readonly
          v-on="on"
          filled
          @input="emitValue()"
        ></v-text-field>
      </template>
      <v-date-picker v-model="productProperty.value"
        @input="productProperty.menu = false"></v-date-picker>
    </v-menu>
    <v-menu
      v-model="productProperty.menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
      v-if="inputType === 'Time'"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="productProperty.value"
          :label="productProperty.name"
          readonly
          v-on="on"
          filled
          @input="emitValue()"
        ></v-text-field>
      </template>
      <v-time-picker v-model="productProperty.value"
        @input="productProperty.menu = false"></v-time-picker>
    </v-menu>
    <v-checkbox v-model="productProperty.value" :label="productProperty.name"
      v-if="inputType === 'Checkbox'" @input="emitValue()"></v-checkbox>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ProductPropertyType from '@/interfaces/ProductPropertyType';

@Component
export default class ProductProperty extends Vue {
  @Prop() private inputType!: string;

  @Prop() private productProperty!: ProductPropertyType;

  emitValue() {
    this.$emit('update:productProperty', this.productProperty);
  }
}
</script>
