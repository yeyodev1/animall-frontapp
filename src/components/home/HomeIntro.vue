<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { MOTION_OK, useGsap, gsap } from '@/composables/home/useMotion'
import TennisBall from './TennisBall.vue'

const root = ref<HTMLElement | null>(null)

// Nube de pelotas gigantes: cada una con su velocidad de parallax.
const balls = [
  { key: 'a', tone: 'white', speed: -6 },
  { key: 'b', tone: 'paper', speed: 4 },
  { key: 'c', tone: 'white', speed: -10 },
  { key: 'd', tone: 'paper', speed: 8 },
] as const

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
      gsap.to(el, {
        yPercent: Number(el.dataset.speed) * 2,
        ease: 'none',
        scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    gsap.from('[data-intro-text]', {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '[data-intro-text]', start: 'top 85%' },
    })
    gsap.from('[data-intro-link]', {
      scale: 0.4,
      rotation: -30,
      duration: 1,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '[data-intro-link]', start: 'top 90%' },
    })
  })
})
</script>

<template>
  <section ref="root" class="intro" aria-label="Sobre Animall">
    <div v-for="b in balls" :key="b.key" class="intro__ball" :class="`intro__ball--${b.key}`" :data-speed="b.speed">
      <TennisBall :tone="b.tone" />
    </div>

    <div class="intro__content">
      <p class="intro__text" data-intro-text>{{ site.intro.text }}</p>
      <RouterLink :to="{ path: '/', hash: '#visitanos' }" class="intro__link" data-intro-link>
        <span class="intro__link-label">{{ site.intro.link }}</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.intro {
  position: relative;
  z-index: 1;
  overflow: hidden;
  background: $mint;
  padding: 11rem 1.25rem 6rem;
  min-height: 720px;
  @include flex(column, center, center);

  @include from('lg') {
    padding: 14rem 2rem 9rem;
    min-height: 100svh;
  }

  &__ball {
    position: absolute;
    aspect-ratio: 1;
    pointer-events: none;

    &--a {
      width: 120vw;
      left: -62vw;
      top: 4%;

      @include from('lg') {
        width: 52vw;
        left: -14vw;
        top: -8%;
      }
    }

    &--b {
      width: 135vw;
      left: -18vw;
      top: 30%;

      @include from('lg') {
        width: 46vw;
        left: 22vw;
        top: 26%;
      }
    }

    &--c {
      width: 110vw;
      right: -66vw;
      top: -6%;

      @include from('lg') {
        width: 44vw;
        right: -12vw;
        top: -14%;
      }
    }

    &--d {
      width: 70vw;
      right: -30vw;
      bottom: -18%;

      @include from('lg') {
        width: 34vw;
        right: -6vw;
        bottom: -22%;
      }
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    @include flex(column, center, center, 2.5rem);
    text-align: center;
  }

  &__text {
    @include display(clamp(1.9rem, 1.1rem + 3.2vw, 3.6rem), $accent-deep);
    line-height: 0.98;
    max-width: 22ch;
  }

  &__link {
    @include flex(row, center, center);
    width: 9.5rem;
    aspect-ratio: 1;
    border-radius: 50%;
    background: $mint-strong;
    color: $accent-deep;
    @include transition;
    @include focus-ring($accent-deep);

    @include from('lg') {
      position: absolute;
      right: -18vw;
      bottom: -10rem;
      width: 12rem;
    }

    &:hover {
      background: $accent-deep;
      color: $surface;
      transform: rotate(-8deg);
    }
  }

  &__link-label {
    font-family: $font-display;
    font-size: 1.5rem;
    text-transform: uppercase;
    @include flex(row, center, center, 0.45rem);

    &::after {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
      margin-top: -3px;
    }
  }
}
</style>
