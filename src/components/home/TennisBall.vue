<script setup lang="ts">
// Pelota de tenis dibujada en SVG: el motivo lúdico que se repite en todo el home.
withDefaults(
  defineProps<{
    tone?: 'ball' | 'paper' | 'white' | 'mint'
    outline?: boolean
  }>(),
  { tone: 'ball', outline: false },
)
</script>

<template>
  <svg class="ball" :class="[`ball--${tone}`, { 'ball--outline': outline }]" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="ball__body" cx="50" cy="50" r="47" />
    <path class="ball__seam" d="M17 13 C 40 32, 40 68, 17 87" />
    <path class="ball__seam" d="M83 13 C 60 32, 60 68, 83 87" />
  </svg>
</template>

<style scoped lang="scss">
.ball {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;

  &__body {
    fill: $ball;
  }

  &__seam {
    fill: none;
    stroke: rgba($surface, 0.95);
    stroke-width: 3;
    stroke-linecap: round;
  }

  &--outline &__body {
    stroke: $ink;
    stroke-width: 3;
  }

  &--outline &__seam {
    stroke: $ink;
    stroke-width: 2.4;
  }

  &--paper &__body {
    fill: $paper;
  }

  &--white &__body {
    fill: #fbfbf4;
  }

  &--mint &__body {
    fill: $mint-strong;
  }

  &--paper &__seam,
  &--white &__seam,
  &--mint &__seam {
    stroke: $surface;
    stroke-width: 1.4;
  }
}
</style>
