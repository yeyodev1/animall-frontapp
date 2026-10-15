<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { MOTION_OK, gsap, useGsap } from '@/composables/home/useMotion'
import TennisBall from './TennisBall.vue'

const root = ref<HTMLElement | null>(null)

// Pelotas sueltas a distintas profundidades: las grandes se mueven más.
const balls = [
  { key: 'a', speed: -40, tone: 'ball' },
  { key: 'b', speed: 30, tone: 'mint' },
  { key: 'c', speed: -70, tone: 'ball' },
  { key: 'd', speed: 55, tone: 'ball' },
  { key: 'e', speed: -25, tone: 'mint' },
  { key: 'f', speed: 80, tone: 'ball' },
] as const

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
      gsap.fromTo(
        el,
        { y: -Number(el.dataset.depth) * 2, rotation: -40 },
        {
          y: Number(el.dataset.depth) * 2,
          rotation: 40,
          ease: 'none',
          scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
    gsap.from('[data-big-line]', {
      yPercent: 100,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '[data-big-title]', start: 'top 80%' },
    })
  })
})
</script>

<template>
  <section ref="root" class="bigline" aria-labelledby="bigline-title">
    <span
      v-for="b in balls"
      :key="b.key"
      class="bigline__ball"
      :class="`bigline__ball--${b.key}`"
      :data-depth="b.speed"
      aria-hidden="true"
    >
      <TennisBall :tone="b.tone" :outline="b.tone === 'ball'" />
    </span>

    <p class="bigline__eyebrow">
      {{ site.bigline.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
    </p>
    <h2 id="bigline-title" class="bigline__title" data-big-title>
      <span v-for="line in site.bigline.title" :key="line" class="bigline__mask">
        <span class="bigline__line" data-big-line>{{ line }}</span>
      </span>
    </h2>
  </section>
</template>

<style scoped lang="scss">
.bigline {
  position: relative;
  overflow: hidden;
  background: $paper;
  padding: 7rem 1rem;
  text-align: center;
  @include flex(column, center, center);

  @include from('lg') {
    min-height: 100svh;
    padding-block: 9rem;
  }

  &__eyebrow {
    @include eyebrow;
    position: relative;
    z-index: 1;
    @include flex(column, center, center, 0.5rem);
    max-width: 28ch;
    margin-bottom: 1.5rem;
  }

  &__title {
    position: relative;
    z-index: 1;
    @include display(clamp(3.2rem, 14.6vw, 16rem), $accent-deep);
    line-height: 0.84;
  }

  &__mask {
    display: block;
    overflow: hidden;
    padding-top: 0.05em;
  }

  &__line {
    display: block;
    white-space: nowrap;
  }

  &__ball {
    position: absolute;
    aspect-ratio: 1;
    pointer-events: none;

    &--a {
      width: 16vw;
      max-width: 170px;
      left: 6%;
      top: 10%;
    }

    &--b {
      width: 36vw;
      max-width: 380px;
      right: -8%;
      top: 4%;
    }

    &--c {
      width: 9vw;
      max-width: 90px;
      right: 18%;
      bottom: 18%;
      z-index: 2;
    }

    &--d {
      width: 12vw;
      max-width: 130px;
      left: 20%;
      bottom: 6%;
      z-index: 2;
    }

    &--e {
      width: 40vw;
      max-width: 420px;
      left: -14%;
      bottom: -12%;
    }

    &--f {
      width: 7vw;
      max-width: 70px;
      right: 8%;
      top: 46%;
    }
  }
}
</style>
