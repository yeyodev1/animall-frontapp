<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; lead?: string }>()
</script>

<template>
  <header class="page-head">
    <div class="page-head__text">
      <p v-if="eyebrow" class="page-head__eyebrow">{{ eyebrow }}</p>
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="lead" class="page-head__lead">{{ lead }}</p>
    </div>
    <div v-if="$slots.default" class="page-head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(row, flex-end, space-between, 1rem);
  flex-wrap: wrap;
  margin-bottom: 1.4rem;

  &__text {
    @include flex(column, flex-start, flex-start, 0.35rem);
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.4rem, 1.8rem + 2.6vw, 3.6rem), $ink);
  }

  &__lead {
    color: $ink-soft;
    font-size: $text-base;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
  }
}
</style>
