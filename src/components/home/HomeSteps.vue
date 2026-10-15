<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useStackedSteps } from '@/composables/home/useStackedSteps'
import StepCard from './StepCard.vue'

const root = ref<HTMLElement | null>(null)
useStackedSteps(root)

// Un pastel distinto por póster, todos del set verde/crema/lila.
const tones = ['#ddf6d0', '#ece6f8', '#ebeadc', '#c3edae']
const icons = ['fa-solid fa-mobile-screen', 'fa-solid fa-cart-shopping', 'fa-brands fa-whatsapp', 'fa-solid fa-bag-shopping']
</script>

<template>
  <section id="como-pedir" ref="root" class="steps" aria-labelledby="steps-title">
    <div class="steps__pin" data-steps-pin>
      <span class="steps__arc" aria-hidden="true"></span>

      <div class="steps__head" data-steps-title>
        <p class="steps__eyebrow">
          {{ site.steps.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
        </p>
        <h2 id="steps-title" class="steps__title">{{ site.steps.title }}</h2>
        <p class="steps__lead">{{ site.steps.lead }}</p>
      </div>

      <ol class="steps__row" data-steps-row>
        <li
          v-for="(item, i) in site.steps.items"
          :key="item.number"
          class="steps__item"
          :class="`steps__item--${i}`"
          :style="{ '--step-bg': tones[i] }"
          data-step
        >
          <StepCard :item="item" :tag="site.steps.eyebrow" :icon="icons[i] ?? 'fa-solid fa-paw'" />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.steps {
  position: relative;
  background: $paper;
  overflow: hidden;

  &__pin {
    position: relative;
    padding: $space-section 0 5rem;

    @include from('lg') {
      height: 100vh;
      min-height: 680px;
      padding: 0;
      @include flex(column, center, center);
    }
  }

  // Arco gigante de fondo, como el círculo rosado de la referencia.
  &__arc {
    position: absolute;
    left: 50%;
    top: 7rem;
    width: 170vw;
    aspect-ratio: 1;
    margin-left: -85vw;
    border-radius: 50%;
    background: $mint;

    @include from('lg') {
      width: 120vw;
      margin-left: -60vw;
      top: 6%;
    }
  }

  &__head {
    position: relative;
    z-index: 1;
    text-align: center;
    padding-inline: 1.25rem;
    @include flex(column, center, center);

    @include from('lg') {
      position: absolute;
      inset: 0;
    }
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(column, center, center, 0.5rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include display(clamp(3.6rem, 2rem + 9vw, 11rem), $accent-deep);
  }

  &__lead {
    margin-top: 1rem;
    color: $ink-soft;
    max-width: 34ch;
    font-size: $text-base;

    @include from('lg') {
      position: absolute;
      bottom: 7%;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      @include eyebrow;
      color: $accent-deep;
    }
  }

  &__row {
    position: relative;
    z-index: 2;
    list-style: none;
    display: flex;
    gap: 1rem;
    margin-top: 2.5rem;
    padding: 1.5rem 1.25rem 2rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 1.25rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @include from('lg') {
      margin: 0;
      padding: 0 2rem;
      overflow: visible;
      justify-content: center;
      gap: 0;
    }
  }

  &__item {
    flex: 0 0 min(78vw, 320px);
    scroll-snap-align: start;

    &:nth-child(odd) {
      transform: rotate(-1.5deg);
    }

    &:nth-child(even) {
      transform: rotate(1.5deg) translateY(10px);
    }

    @include from('lg') {
      flex-basis: clamp(250px, 21vw, 320px);

      & + & {
        margin-left: -2.2vw;
      }

      &--0 {
        transform: rotate(-5deg) translateY(-10px);
      }

      &--1 {
        transform: rotate(2deg) translateY(20px);
      }

      &--2 {
        transform: rotate(-2deg) translateY(-4px);
      }

      &--3 {
        transform: rotate(5deg) translateY(34px);
      }
    }
  }
}
</style>
