<script setup lang="ts">
defineProps<{ icon?: string; message: string; tone?: 'neutral' | 'error' }>()
</script>

<template>
  <div class="empty" :class="{ 'empty--error': tone === 'error' }" role="status">
    <span class="empty__icon" aria-hidden="true">
      <i :class="icon || 'fa-solid fa-paw'"></i>
    </span>
    <p class="empty__message">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty {
  @include flex(column, center, center, 0.8rem);
  text-align: center;
  padding: 2.8rem 1.25rem;
  border: 1.5px dashed $line;
  border-radius: $radius-md;
  background: rgba($surface, 0.6);

  &__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: $mint;
    color: $accent-deep;
    font-size: 1.4rem;
    @include flex(row, center, center);
  }

  &__message {
    color: $ink-soft;
    max-width: 34ch;
  }

  &--error &__icon {
    background: $danger-bg;
    color: $danger;
  }
}
</style>
