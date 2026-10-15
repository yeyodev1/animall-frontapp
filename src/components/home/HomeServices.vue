<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { MOTION_OK, gsap, prefersReducedMotion, useGsap } from '@/composables/home/useMotion'
import { useServiceCarousel } from '@/composables/home/useServiceCarousel'
import TennisBall from './TennisBall.vue'
import ServiceSlide from './ServiceSlide.vue'

const items = site.services.items
const root = ref<HTMLElement | null>(null)
const { index, direction, go, next, prev, onKeydown, onPointerDown, onPointerUp } = useServiceCarousel(items.length)
const current = computed(() => items[index.value]!)

// La primera "o" del título se reemplaza por una pelota, como la referencia.
const title = site.services.title
let ballUsed = false
const words = title.split(' ').map((word) => {
  const at = ballUsed ? -1 : word.toLowerCase().indexOf('o')
  if (at < 0) return { word, before: word, after: '', ball: false }
  ballUsed = true
  return { word, before: word.slice(0, at), after: word.slice(at + 1), ball: true }
})

function onLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  node.style.position = 'absolute'
  node.style.inset = '0 0 auto 0'
  if (prefersReducedMotion()) return done()
  gsap.to(node.querySelectorAll('[data-anim]'), {
    x: -direction.value * 90,
    opacity: 0,
    duration: 0.35,
    ease: 'power2.in',
    stagger: 0.03,
    onComplete: done,
  })
}

function onEnter(el: Element, done: () => void) {
  if (prefersReducedMotion()) return done()
  const node = el as HTMLElement
  const tl = gsap.timeline({ delay: 0.22, onComplete: done })
  tl.from(node.querySelectorAll('[data-anim]'), {
    x: direction.value * 90,
    opacity: 0,
    duration: 0.7,
    ease: 'expo.out',
    stagger: 0.05,
  }).from(node.querySelector('[data-art]'), { rotation: direction.value * 14, scale: 0.85, duration: 0.9, ease: 'back.out(1.5)' }, 0)
}

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.from('[data-svc-word]', {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '[data-svc-title]', start: 'top 85%' },
    })
    gsap.from('[data-svc-ball]', {
      rotation: -360,
      y: -200,
      duration: 1.4,
      ease: 'bounce.out',
      scrollTrigger: { trigger: '[data-svc-title]', start: 'top 80%' },
    })
  })
})
</script>

<template>
  <section id="servicios" ref="root" class="svc" aria-labelledby="svc-title">
    <div class="svc__head">
      <p class="svc__eyebrow">
        {{ site.services.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
      </p>
      <h2 id="svc-title" class="svc__title" data-svc-title :aria-label="title">
        <template v-for="w in words" :key="w.word">
          <span class="svc__word" aria-hidden="true" data-svc-word
            >{{ w.before }}<span v-if="w.ball" class="svc__o" data-svc-ball><TennisBall outline /></span>{{ w.after }}</span
          >{{ ' ' }}
        </template>
      </h2>
    </div>

    <div
      class="svc__stage"
      tabindex="0"
      role="group"
      aria-roledescription="carrusel"
      :aria-label="`${current.title}, ${index + 1} de ${items.length}`"
      @keydown="onKeydown"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    >
      <button type="button" class="svc__nav svc__nav--prev" aria-label="Servicio anterior" @click="prev">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>

      <div class="svc__slides" aria-live="polite">
        <Transition :css="false" @enter="onEnter" @leave="onLeave">
          <ServiceSlide :key="current.key" :item="current" :total="items.length" />
        </Transition>
      </div>

      <button type="button" class="svc__nav svc__nav--next" aria-label="Servicio siguiente" @click="next">
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>

    <div class="svc__tabs" role="tablist" aria-label="Servicios">
      <button
        v-for="(item, i) in items"
        :key="item.key"
        type="button"
        role="tab"
        class="svc__tab"
        :class="{ 'is-active': i === index }"
        :aria-selected="i === index"
        @click="go(i)"
      >
        <span>{{ item.number }}</span> {{ item.title }}
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.svc {
  position: relative;
  background: $mint;
  overflow: hidden;
  padding: 6rem 1.25rem $space-section;

  @include from('lg') {
    padding: 8rem 2rem $space-section;
  }

  &__head {
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(column, center, center, 0.5rem);
    margin-bottom: 1.2rem;
  }

  &__title {
    @include display(clamp(4rem, 21vw, 15rem), $accent-deep);
    line-height: 0.84;
  }

  &__word {
    display: inline-block;
    white-space: nowrap;
  }

  &__o {
    display: inline-block;
    width: 0.66em;
    height: 0.66em;
    margin-inline: 0.02em;
    vertical-align: 0.06em;
  }

  &__stage {
    position: relative;
    max-width: 1240px;
    margin: 3rem auto 0;
    outline: none;
    touch-action: pan-y;

    @include from('lg') {
      margin-top: 4.5rem;
      padding-inline: 5.5rem;
    }

    &:focus-visible {
      outline: 2px dashed $accent-deep;
      outline-offset: 12px;
      border-radius: $radius-lg;
    }
  }

  &__slides {
    position: relative;
  }

  &__nav {
    position: absolute;
    z-index: 2;
    // En mobile, a media altura del círculo.
    top: min(42vw, 210px);
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: $surface;
    color: $ink;
    font-size: 1.1rem;
    box-shadow: $shadow-sm;
    @include flex(row, center, center);
    @include transition;
    @include focus-ring($accent-deep);

    &:hover {
      background: $ink;
      color: $accent;
      transform: scale(1.08);
    }

    &--prev {
      left: -0.4rem;
    }

    &--next {
      right: -0.4rem;
    }

    @include from('lg') {
      top: 50%;
      margin-top: -36px;
      width: 72px;
      height: 72px;
      font-size: 1.3rem;

      &--prev {
        left: 0;
      }

      &--next {
        right: 0;
      }
    }
  }

  &__tabs {
    @include flex(row, center, center, 0.5rem);
    flex-wrap: wrap;
    margin-top: 3rem;
  }

  &__tab {
    @include eyebrow;
    color: $ink-soft;
    min-height: 44px;
    padding: 0 1rem;
    border-radius: $radius-pill;
    border: 1.5px solid rgba($accent-deep, 0.25);
    @include transition;
    @include focus-ring($accent-deep);

    span {
      color: $accent-deep;
      margin-right: 0.3rem;
    }

    &:hover {
      border-color: $accent-deep;
    }

    &.is-active {
      background: $accent-deep;
      border-color: $accent-deep;
      color: $surface;

      span {
        color: $accent;
      }
    }
  }
}
</style>
