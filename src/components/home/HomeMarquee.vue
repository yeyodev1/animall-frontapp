<script setup lang="ts">
import { site } from '@/config/site'
import PawPrint from './PawPrint.vue'

// La lista se pinta dos veces: al terminar la primera, la segunda ocupa su lugar
// exacto y el loop no tiene salto.
const copies = [0, 1]
</script>

<template>
  <div class="marquee" role="marquee" :aria-label="site.marquee.join(', ')">
    <div class="marquee__track">
      <ul v-for="c in copies" :key="c" class="marquee__list" :aria-hidden="c === 1">
        <li v-for="word in site.marquee" :key="word" class="marquee__item">
          <span>{{ word }}</span>
          <PawPrint class="marquee__paw" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marquee {
  position: relative;
  z-index: 3;
  background: $ink;
  color: $accent;
  overflow: hidden;
  padding-block: 0.95rem 0.7rem;
  // Cinta un poco inclinada, como una correa cruzando la página.
  transform: rotate(-1.6deg) scale(1.04);
  margin-block: -1rem;

  &__track {
    display: flex;
    width: max-content;
    animation: marquee 32s linear infinite;
  }

  &:hover &__track {
    animation-play-state: paused;
  }

  &__list {
    list-style: none;
    display: flex;
    flex-shrink: 0;
  }

  &__item {
    @include flex(row, center, center, 1.6rem);
    padding-right: 1.6rem;
    font-family: $font-display;
    font-size: clamp(1.8rem, 1.2rem + 2.4vw, 3.4rem);
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
  }

  &__paw {
    font-size: 0.55em;
    color: $ball;
    transform: rotate(18deg) translateY(-0.08em);
  }
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}
</style>
