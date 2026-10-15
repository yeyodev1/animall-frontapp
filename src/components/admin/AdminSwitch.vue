<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; busy?: boolean; showLabel?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="switch"
    :class="{ 'is-on': modelValue, 'is-busy': busy, 'switch--labeled': showLabel }"
    :aria-checked="modelValue"
    :aria-label="showLabel ? undefined : label"
    :aria-busy="busy || undefined"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="switch__track" aria-hidden="true">
      <span class="switch__thumb"></span>
    </span>
    <span v-if="showLabel" class="switch__label">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
.switch {
  @include flex(row, center, flex-start, 0.65rem);
  min-height: 44px;
  padding: 0.2rem;
  border-radius: $radius-pill;
  text-align: left;

  &__track {
    position: relative;
    flex: none;
    width: 46px;
    height: 26px;
    border-radius: $radius-pill;
    background: $line;
    box-shadow: inset 0 0 0 1px rgba($ink, 0.08);
    @include transition(background);
  }

  &__thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $surface;
    box-shadow: 0 1px 3px rgba($ink, 0.25);
    transition: transform 0.25s $ease;
  }

  &.is-on &__track {
    background: $accent-deep;
  }

  &.is-on &__thumb {
    transform: translateX(20px);
  }

  &.is-busy {
    opacity: 0.7;
  }

  &__label {
    font-size: 0.92rem;
    font-weight: 500;
    color: $ink;
  }
}
</style>
