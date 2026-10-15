<script setup lang="ts">
import type { Product } from '@/types'

defineProps<{ product: Product }>()
</script>

<template>
  <article>{{ product.name }}</article>
</template>
