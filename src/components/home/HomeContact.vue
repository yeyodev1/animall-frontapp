<script setup lang="ts">
import { ref } from 'vue'
import { contacts, site, whatsappLink } from '@/config/site'
import { MOTION_OK, gsap, useGsap } from '@/composables/home/useMotion'
import TennisBall from './TennisBall.vue'

const root = ref<HTMLElement | null>(null)

// Pelotas que caen y rebotan al llegar a la sección; posición en % del ancho.
const balls = [
  { x: 6, size: 'lg' },
  { x: 24, size: 'sm' },
  { x: 47, size: 'md' },
  { x: 70, size: 'sm' },
  { x: 86, size: 'lg' },
] as const

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.from('[data-drop]', {
      y: () => -(root.value?.offsetHeight ?? 900),
      rotation: () => gsap.utils.random(-360, 360),
      duration: () => gsap.utils.random(1.3, 1.9),
      ease: 'bounce.out',
      stagger: 0.12,
      scrollTrigger: { trigger: root.value, start: 'top 45%' },
    })
    gsap.from('[data-contact-line]', {
      yPercent: 100,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: root.value, start: 'top 70%' },
    })
    gsap.from('[data-promise]', {
      scale: 0,
      rotation: -90,
      duration: 1.2,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '[data-promise]', start: 'top 90%' },
    })
  })
})
</script>

<template>
  <section id="contacto" ref="root" class="contact" aria-labelledby="contact-title">
    <div class="contact__inner">
      <div class="contact__head">
        <p class="contact__eyebrow">
          {{ site.contact.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
        </p>
        <h2 id="contact-title" class="contact__title">
          <span v-for="line in site.contact.title" :key="line" class="contact__mask">
            <span class="contact__line" data-contact-line>{{ line }}</span>
          </span>
        </h2>
        <p class="contact__lead">{{ site.contact.lead }}</p>
        <p class="contact__promise" data-promise>{{ site.promise }}</p>
      </div>

      <ul class="contact__cards">
        <li v-for="c in contacts" :key="c.key" class="contact__card">
          <p class="contact__label">{{ c.label }}</p>
          <h3 class="contact__name">{{ c.name }}</h3>
          <a :href="`tel:+${c.whatsapp}`" class="contact__phone">
            <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ c.phone }}
          </a>
          <a
            :href="whatsappLink(undefined, c.whatsapp)"
            class="btn btn--primary btn--dot contact__wa"
            target="_blank"
            rel="noopener"
            :aria-label="`WhatsApp de ${c.name}`"
          >
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp
          </a>
        </li>
      </ul>
    </div>

    <div class="contact__floor" aria-hidden="true">
      <span
        v-for="(b, i) in balls"
        :key="i"
        class="contact__ball"
        :class="`contact__ball--${b.size}`"
        :style="{ left: `${b.x}%` }"
        data-drop
      >
        <TennisBall />
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  position: relative;
  overflow: hidden;
  background: $night;
  color: $paper;
  padding: $space-section 1.25rem 0;

  @include from('lg') {
    padding-inline: 2rem;
  }

  &__inner {
    // Las pelotas caen por detrás del texto y las tarjetas.
    position: relative;
    z-index: 1;
    max-width: 1240px;
    margin-inline: auto;
    @include flex(column, stretch, flex-start, 3rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  &__head {
    position: relative;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent;
    @include flex(row, center, flex-start, 0.5rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include display(clamp(3.6rem, 18vw, 13rem), $accent);
    line-height: 0.84;
  }

  &__mask {
    display: block;
    overflow: hidden;
    padding-top: 0.06em;
  }

  &__line {
    display: block;
    white-space: nowrap;
  }

  &__lead {
    margin-top: 1.2rem;
    font-size: $text-lg;
    color: rgba($paper, 0.8);
  }

  &__promise {
    @include flex(row, center, center);
    width: 9.5rem;
    aspect-ratio: 1;
    padding: 1rem;
    border-radius: 50%;
    background: $ball;
    color: $ink;
    font-family: $font-display;
    font-size: 1.15rem;
    line-height: 0.95;
    text-transform: uppercase;
    text-align: center;
    transform: rotate(-12deg);
    margin: 1.5rem 0 0 auto;

    @include from('lg') {
      position: absolute;
      width: 12rem;
      font-size: 1.5rem;
      right: -2rem;
      top: 0;
      margin: 0;
    }
  }

  &__cards {
    list-style: none;
    @include flex-cards(260px, 1rem);

    @include from('lg') {
      flex: 0 1 600px;
    }
  }

  &__card {
    border: 1px solid rgba($paper, 0.16);
    border-radius: $radius-lg;
    padding: 1.6rem;
    background: rgba($paper, 0.03);
    @include flex(column, flex-start, flex-start, 0.4rem);
    @include transition(border-color);

    &:hover {
      border-color: $accent;
    }
  }

  &__label {
    @include eyebrow;
    color: $accent;
  }

  &__name {
    @include display(clamp(2rem, 1.6rem + 1.4vw, 2.8rem), $paper);
  }

  &__phone {
    @include flex(row, center, flex-start, 0.5rem);
    min-height: 44px;
    color: rgba($paper, 0.85);
    font-weight: 500;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &__wa {
    margin-top: 0.4rem;
  }

  &__floor {
    position: relative;
    height: 9rem;
    margin-top: 3rem;
    margin-inline: -1.25rem;

    @include from('lg') {
      height: 13rem;
      margin-inline: -2rem;
    }
  }

  &__ball {
    position: absolute;
    bottom: 0;
    aspect-ratio: 1;
    margin-left: -2rem;

    &--sm {
      width: 3.5rem;
    }

    &--md {
      width: 5.5rem;
    }

    &--lg {
      width: 8rem;

      @include from('lg') {
        width: 11rem;
      }
    }
  }
}
</style>
