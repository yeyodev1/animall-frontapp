<script setup lang="ts">
import { computed } from 'vue'
import { statusLabel } from '@/composables/admin/adminFormat'

const props = defineProps<{ status: string }>()
const label = computed(() => statusLabel(props.status))
</script>

<template>
  <span class="pill" :class="`pill--${status}`">
    <span class="pill__dot" aria-hidden="true"></span>
    {{ label }}
  </span>
</template>

<style scoped lang="scss">
.pill {
  @include flex(row, center, flex-start, 0.4rem);
  display: inline-flex;
  padding: 0.28rem 0.7rem;
  border-radius: $radius-pill;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1.2;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  &--nueva {
    background: $ball;
    color: $ink;
  }

  &--confirmada {
    background: $info-bg;
    color: #2e577c;
  }

  &--entregada {
    background: $success-bg;
    color: $accent-deep;
  }

  &--cancelada {
    background: $sand;
    color: $ink-muted;
    text-decoration: line-through;
  }
}
</style>
