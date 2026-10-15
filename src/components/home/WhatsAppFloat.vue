<script setup lang="ts">
import { site, whatsappLink } from '@/config/site'
</script>

<template>
  <Teleport to="body">
    <a :href="whatsappLink()" class="wa-float" target="_blank" rel="noopener" :aria-label="site.hero.ctaSecondary">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      <span class="wa-float__label">{{ site.hero.ctaSecondary }}</span>
    </a>
  </Teleport>
</template>

<style scoped lang="scss">
.wa-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 90;
  height: 58px;
  min-width: 58px;
  padding: 0 1.05rem;
  border-radius: $radius-pill;
  background: $accent;
  color: $ink;
  box-shadow: 0 10px 30px rgba($ink, 0.25);
  @include flex(row, center, center, 0.6rem);
  @include transition;
  @include focus-ring($ink);

  @include from('md') {
    right: 1.5rem;
    bottom: 1.5rem;
  }

  i {
    font-size: 1.8rem;
  }

  // Anillo que late: llama la atención sin moverse de lugar.
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 2px solid $accent;
    animation: wa-ring 2.4s ease-out infinite;
    pointer-events: none;
  }

  &__label {
    font-family: $font-display;
    font-size: 1.15rem;
    text-transform: uppercase;
    line-height: 1;
    padding-top: 0.15em;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 0.4s $ease;
  }

  &:hover &__label,
  &:focus-visible &__label {
    max-width: 14rem;
  }

  &:hover {
    background: $ink;
    color: $accent;
  }
}

@keyframes wa-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.45);
    opacity: 0;
  }
}
</style>
