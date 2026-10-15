<script setup lang="ts">
import { productCopy } from '@/composables/catalog/copy'
import TennisBall from './TennisBall.vue'
</script>

<template>
  <section class="lost">
    <div class="lost__art" aria-hidden="true">
      <span class="lost__big">4</span>
      <TennisBall class="lost__ball" size="clamp(5rem, 16vw, 9rem)" />
      <span class="lost__big">4</span>
    </div>
    <h1 class="lost__title">{{ productCopy.notFoundTitle }}</h1>
    <p class="lost__text">{{ productCopy.notFoundText }}</p>
    <RouterLink to="/catalogo" class="btn btn--dark btn--dot">{{ productCopy.notFoundCta }}</RouterLink>
  </section>
</template>

<style scoped lang="scss">
.lost {
  @include container(820px);
  @include flex(column, center, center, 1rem);
  text-align: center;
  padding-block: $space-xl $space-section;

  &__art {
    @include flex(row, center, center, 0.6rem);
  }

  &__big {
    @include display(clamp(7rem, 26vw, 14rem), $accent-deep);
  }

  &__title {
    @include display($display-md, $ink);
  }

  &__text {
    max-width: 44ch;
    color: $ink-soft;
    margin-bottom: 0.6rem;
  }
}
</style>
