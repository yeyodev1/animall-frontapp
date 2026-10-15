<script setup lang="ts">
import { adminCopy } from '@/components/admin/adminCopy'

defineProps<{ page: number; pages: number }>()
const emit = defineEmits<{ go: [page: number] }>()
const copy = adminCopy.pager
</script>

<template>
  <nav v-if="pages > 1" class="pager" aria-label="Paginación">
    <button type="button" class="pager__btn" :disabled="page <= 1" @click="emit('go', page - 1)">
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      <span>{{ copy.prev }}</span>
    </button>
    <span class="pager__status" aria-live="polite">{{ copy.page(page, pages) }}</span>
    <button type="button" class="pager__btn" :disabled="page >= pages" @click="emit('go', page + 1)">
      <span>{{ copy.next }}</span>
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
  </nav>
</template>

<style scoped lang="scss">
.pager {
  @include flex(row, center, space-between, 0.8rem);
  margin-top: 1.4rem;

  @include from('md') {
    justify-content: center;
  }

  &__btn {
    @include flex(row, center, center, 0.5rem);
    min-height: 44px;
    padding: 0.5rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-weight: 600;
    font-size: 0.88rem;
    @include transition(border-color);

    &:hover:not(:disabled) {
      border-color: $ink;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  &__status {
    font-size: 0.85rem;
    color: $ink-soft;
    font-variant-numeric: tabular-nums;
  }
}
</style>
