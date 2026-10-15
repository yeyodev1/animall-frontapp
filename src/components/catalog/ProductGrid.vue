<script setup lang="ts">
import type { Product } from '@/types'
import ProductCard from './ProductCard.vue'
import ProductSkeleton from './ProductSkeleton.vue'

withDefaults(defineProps<{ items: Product[]; skeletons?: number }>(), { skeletons: 0 })
</script>

<template>
  <div class="grid">
    <ProductCard v-for="product in items" :key="product._id" :product="product" />
    <ProductSkeleton v-for="n in skeletons" :key="`s${n}`" />
    <!-- Relleno invisible: la última fila no se estira cuando quedan pocas tarjetas. -->
    <span v-for="n in 3" :key="`f${n}`" class="grid__filler" aria-hidden="true"></span>
  </div>
</template>

<style scoped lang="scss">
.grid {
  @include flex-cards(150px, 0.75rem);
  align-items: stretch;

  @include from('md') {
    @include flex-cards(220px, 1.1rem);
  }

  @include from('xl') {
    @include flex-cards(205px, 1.25rem);
  }

  > .grid__filler {
    height: 0;
    margin-bottom: -0.75rem;

    @include from('md') {
      margin-bottom: -1.1rem;
    }
  }
}
</style>
