<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { cld, photos } from '@/config/site'
import { adminCopy } from '@/components/admin/adminCopy'

const copy = adminCopy.login
const logo = cld(photos.logo, 'f_auto,q_auto,w_200')

// Huellitas decorativas: posición, tamaño y giro de cada una.
const paws = [
  { top: '12%', left: '78%', size: 2.6, rot: 18 },
  { top: '30%', left: '88%', size: 1.6, rot: -12 },
  { top: '62%', left: '82%', size: 3.4, rot: 28 },
  { top: '80%', left: '64%', size: 1.8, rot: -20 },
  { top: '8%', left: '46%', size: 1.3, rot: 40 },
]
</script>

<template>
  <aside class="hero">
    <RouterLink to="/" class="hero__logo" :aria-label="copy.back">
      <img :src="logo" alt="Animall" width="120" height="40" />
    </RouterLink>

    <i
      v-for="(paw, i) in paws"
      :key="i"
      class="fa-solid fa-paw hero__paw"
      aria-hidden="true"
      :style="{ top: paw.top, left: paw.left, fontSize: `${paw.size}rem`, transform: `rotate(${paw.rot}deg)` }"
    ></i>

    <div class="hero__copy">
      <p class="hero__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="hero__title">
        {{ copy.headline }}
        <span>{{ copy.headlineAccent }}</span>
      </h1>
      <p class="hero__pitch">{{ copy.pitch }}</p>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  background: $accent;
  color: $ink;
  @include flex(column, flex-start, space-between, 1.4rem);
  padding: 1.2rem 1.25rem 1.6rem;

  @include from('lg') {
    flex: 1 1 55%;
    padding: 2.5rem 3rem 3.5rem;
  }

  &__logo {
    position: relative;
    z-index: 1;
    border-radius: $radius-sm;

    img {
      width: 84px;
      height: auto;

      @include from('lg') {
        width: 120px;
      }
    }
  }

  &__paw {
    position: absolute;
    color: rgba($ink, 0.12);
    pointer-events: none;
  }

  &__copy {
    position: relative;
    z-index: 1;
    @include flex(column, flex-start, flex-start, 0.9rem);
    max-width: 640px;
  }

  &__eyebrow {
    @include eyebrow;
    color: $ink;
  }

  &__title {
    @include display(clamp(3rem, 1.6rem + 8vw, 9.5rem), $ink);
    line-height: 0.84;

    span {
      display: block;
      color: $surface;
      -webkit-text-stroke: 2px $ink;
      paint-order: stroke fill;
    }
  }

  &__pitch {
    font-size: $text-base;
    font-weight: 500;
    max-width: 30ch;

    @include from('lg') {
      font-size: $text-lg;
    }
  }
}
</style>
