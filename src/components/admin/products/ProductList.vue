<script setup lang="ts">
import ProductRow from './ProductRow.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import type { Product } from '@/types'

defineProps<{ products: Product[]; busy: Record<string, boolean> }>()
const emit = defineEmits<{
  toggle: [product: Product, field: 'isPublished' | 'isFeatured']
  edit: [product: Product]
  remove: [product: Product]
}>()
const copy = adminCopy.products
</script>

<template>
  <table class="list">
    <caption class="visually-hidden">{{ copy.title }}</caption>
    <thead class="list__head">
      <tr>
        <th scope="col">{{ copy.colProduct }}</th>
        <th scope="col" class="list__num">{{ copy.colPrice }}</th>
        <th scope="col">{{ copy.colPublished }}</th>
        <th scope="col">{{ copy.colFeatured }}</th>
        <th scope="col" class="list__num"><span class="visually-hidden">{{ copy.colActions }}</span></th>
      </tr>
    </thead>
    <tbody class="list__body">
      <ProductRow
        v-for="product in products"
        :key="product._id"
        :product="product"
        :busy-published="busy[`${product._id}:isPublished`]"
        :busy-featured="busy[`${product._id}:isFeatured`]"
        @toggle="(field) => emit('toggle', product, field)"
        @edit="emit('edit', product)"
        @remove="emit('remove', product)"
      />
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.list {
  display: block;
  width: 100%;
  border-collapse: collapse;

  @include from('lg') {
    display: table;
    @include card;
    overflow: hidden;
  }

  &__head {
    display: none;

    @include from('lg') {
      display: table-header-group;
      background: $paper;

      th {
        text-align: left;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: $ink-soft;
        padding: 0.75rem 0.8rem;
        border-bottom: 1px solid $line;
      }
    }
  }

  &__num {
    text-align: right !important;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);

    @include from('lg') {
      display: table-row-group;
    }
  }
}
</style>
