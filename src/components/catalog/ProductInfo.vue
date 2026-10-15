<script setup lang="ts">
import { computed } from 'vue'
import { site } from '@/config/site'
import type { Product } from '@/types'
import { speciesIcons, typeIcons } from '@/composables/catalog/productMedia'
import { catalogCopy } from '@/config/site'

const props = defineProps<{ product: Product }>()

const tags = computed(() => {
  const p = props.product
  const list = [
    { icon: speciesIcons[p.species] ?? 'fa-paw', label: site.labels.species[p.species] ?? p.species },
    { icon: typeIcons[p.type] ?? 'fa-tag', label: site.labels.types[p.type] ?? p.type },
  ]
  if (p.catalogs?.includes('super-premium')) list.push({ icon: 'fa-star', label: catalogCopy.superPremium })
  return list
})
</script>

<template>
  <header class="info">
    <p v-if="product.brand" class="info__eyebrow">
      <span class="info__sep" aria-hidden="true"></span>{{ product.brand }}
    </p>
    <h1 class="info__title">{{ product.name }}</h1>
    <ul class="info__tags">
      <li v-for="tag in tags" :key="tag.label" class="info__tag">
        <i :class="`fa-solid ${tag.icon}`" aria-hidden="true"></i>{{ tag.label }}
      </li>
    </ul>
  </header>
</template>

<style scoped lang="scss">
.info {
  @include flex(column, flex-start, flex-start, 0.9rem);

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
    flex-wrap: wrap;
  }

  &__sep {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $accent-deep;
  }

  &__title {
    @include display(clamp(2.6rem, 1.6rem + 4.2vw, 5.2rem), $ink);
    line-height: 0.88;
    overflow-wrap: anywhere;
  }

  &__tags {
    list-style: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__tag {
    @include flex(row, center, flex-start, 0.45rem);
    padding: 0.4rem 0.85rem;
    border-radius: $radius-pill;
    background: $surface;
    font-size: 0.8rem;
    font-weight: 600;
    color: $ink;

    i {
      color: $accent-deep;
    }
  }
}
</style>
