<script setup lang="ts">
// Pelota de tenis decorativa (el guiño lúdico de la referencia). Solo adorno.
withDefaults(defineProps<{ size?: string }>(), { size: '3rem' })
</script>

<template>
  <span class="ball" :style="{ '--size': size }" aria-hidden="true"></span>
</template>

<style scoped lang="scss">
.ball {
  position: relative;
  display: block;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, lighten($ball, 12%), $ball 55%, darken($ball, 10%));
  overflow: hidden;
  flex-shrink: 0;

  // Las dos costuras curvas
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: calc(var(--size) * 0.045) solid rgba($surface, 0.9);
  }

  &::before {
    left: -62%;
  }

  &::after {
    right: -62%;
  }
}
</style>
