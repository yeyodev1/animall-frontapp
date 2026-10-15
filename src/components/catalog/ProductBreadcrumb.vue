<script setup lang="ts">
import { productCopy } from '@/config/site'

defineProps<{ category: string; categorySlug: string; name: string }>()
</script>

<template>
  <nav class="crumbs" :aria-label="productCopy.breadcrumb">
    <ol>
      <li><RouterLink to="/">{{ productCopy.home }}</RouterLink></li>
      <li><RouterLink to="/catalogo">{{ productCopy.catalog }}</RouterLink></li>
      <li v-if="category">
        <RouterLink :to="{ path: '/catalogo', query: { category: categorySlug } }">{{ category }}</RouterLink>
      </li>
      <li aria-current="page">{{ name }}</li>
    </ol>
  </nav>
</template>

<style scoped lang="scss">
.crumbs ol {
  list-style: none;
  @include flex(row, center, flex-start, 0.35rem);
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
  font-size: 0.78rem;
  font-weight: 600;
  color: $ink-muted;

  li {
    @include flex(row, center, flex-start, 0.35rem);
    max-width: 100%;

    &:not(:last-child)::after {
      content: '/';
      color: $line;
    }

    &:last-child {
      color: $ink;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      // En el celular el nombre ya está en el titular gigante.
      @include until('md') {
        display: none;
      }
    }

    &:nth-last-child(2)::after {
      @include until('md') {
        display: none;
      }
    }
  }

  a {
    min-height: 32px;
    @include flex(row, center);

    &:hover {
      color: $accent-deep;
      text-decoration: underline;
    }
  }
}
</style>
