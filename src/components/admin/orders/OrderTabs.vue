<script setup lang="ts">
import type { OrderStatus } from '@/types'

defineProps<{ tabs: { value: OrderStatus | ''; label: string; count: number }[] }>()
const model = defineModel<OrderStatus | ''>({ required: true })
</script>

<template>
  <div class="tabs" role="tablist" aria-label="Estado del pedido">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      class="tabs__tab"
      :class="[`tabs__tab--${tab.value || 'all'}`, { 'is-active': model === tab.value }]"
      :aria-selected="model === tab.value"
      @click="model = tab.value"
    >
      {{ tab.label }}
      <span class="tabs__count">{{ tab.count }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.tabs {
  @include flex(row, center, flex-start, 0.4rem);
  overflow-x: auto;
  scrollbar-width: none;
  margin: 0 -1rem 1.1rem;
  padding: 0.2rem 1rem;

  @include from('lg') {
    margin-inline: 0;
    padding-inline: 0;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  &__tab {
    flex: none;
    @include flex(row, center, center, 0.5rem);
    min-height: 44px;
    padding: 0.45rem 0.6rem 0.45rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    font-weight: 600;
    font-size: 0.88rem;
    white-space: nowrap;
    @include transition(background);

    &:hover {
      border-color: $ink;
    }

    &.is-active {
      background: $night;
      border-color: $night;
      color: $paper;

      .tabs__count {
        background: $accent;
        color: $ink;
      }
    }
  }

  &__count {
    min-width: 26px;
    height: 26px;
    padding-inline: 7px;
    border-radius: $radius-pill;
    background: $sand;
    font-size: 0.75rem;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    @include flex(row, center, center);
  }

  &__tab--nueva:not(.is-active) .tabs__count {
    background: $ball;
  }
}
</style>
