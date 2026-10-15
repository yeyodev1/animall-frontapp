<script setup lang="ts">
const props = withDefaults(
  defineProps<{ modelValue: number; label: string; decLabel: string; incLabel: string; min?: number; size?: 'sm' | 'md' }>(),
  { min: 1, size: 'md' },
)
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

function set(value: number) {
  emit('update:modelValue', Math.min(99, Math.max(props.min, value)))
}
</script>

<template>
  <div class="qty" :class="`qty--${size}`" role="group" :aria-label="label">
    <button type="button" class="qty__btn" :aria-label="decLabel" @click="set(modelValue - 1)">
      <i class="fa-solid fa-minus"></i>
    </button>
    <output class="qty__value" aria-live="polite">{{ modelValue }}</output>
    <button type="button" class="qty__btn" :aria-label="incLabel" :disabled="modelValue >= 99" @click="set(modelValue + 1)">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  --h: 52px;
  @include flex(row, center, space-between);
  height: var(--h);
  border-radius: $radius-pill;
  border: 1.5px solid $ink;
  background: $surface;
  padding: 4px;
  flex-shrink: 0;

  &__btn {
    width: calc(var(--h) - 10px);
    height: calc(var(--h) - 10px);
    border-radius: 50%;
    @include flex(row, center, center);
    font-size: 0.8rem;
    color: $ink;
    transition: background-color 0.2s ease;

    &:hover {
      background: $mint;
    }

    &:disabled {
      opacity: 0.35;
    }
  }

  &__value {
    min-width: 2.2ch;
    text-align: center;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  &--sm {
    --h: 38px;
    border-width: 1px;
    border-color: $line;

    .qty__value {
      font-size: 0.9rem;
    }

    .qty__btn {
      font-size: 0.68rem;
    }
  }
}
</style>
