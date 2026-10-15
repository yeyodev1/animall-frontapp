<script setup lang="ts">
import { ref } from 'vue'
import { art, cld, contacts, photos, site, whatsappLink } from '@/config/site'
import { MOTION_OK, gsap, useGsap } from '@/composables/home/useMotion'
import ArtImage from './ArtImage.vue'

const root = ref<HTMLElement | null>(null)
const store = contacts.find((c) => c.key === 'americas') ?? contacts[0]

// TODO copy: textos alternativos de las fotos del local (site.visit.photos)
const gallery = [
  { key: 'entrada', src: photos.entrada, alt: 'Entrada del local de Animall en Plaza Las Américas', depth: 30 },
  { key: 'estanterias', src: photos.estanterias, alt: 'Estanterías llenas de alimento y accesorios en Animall', depth: -50 },
  { key: 'neon', src: photos.neon, alt: 'Letrero de neón verde de Animall dentro del local', depth: 60 },
  { key: 'grooming', src: photos.grooming, alt: 'Área de grooming con tina y mesa profesional', depth: -30 },
]

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.utils.toArray<HTMLElement>('[data-photo]').forEach((el) => {
      const depth = Number(el.dataset.photo)
      gsap.fromTo(
        el,
        { y: depth },
        { y: -depth, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })
    gsap.from('[data-tail]', {
      yPercent: 60,
      rotation: -8,
      duration: 1.4,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: { trigger: '[data-tail]', start: 'top bottom' },
    })
  })
})
</script>

<template>
  <section id="visitanos" ref="root" class="visit" aria-labelledby="visit-title">
    <div class="visit__content">
      <p class="visit__eyebrow">
        {{ site.visit.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
      </p>
      <h2 id="visit-title" class="visit__title">
        {{ site.visit.title }}
        <span class="visit__handle">@{{ site.visit.handle }}</span>
      </h2>
      <p class="visit__text">{{ site.visit.text }}</p>
      <div class="visit__actions">
        <a :href="whatsappLink(undefined, store.whatsapp)" class="btn btn--dark btn--dot" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ site.hero.ctaSecondary }}
        </a>
        <a :href="`tel:+${store.whatsapp}`" class="visit__phone">
          <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ store.phone }}
        </a>
      </div>
    </div>

    <ul class="visit__photos">
      <li v-for="p in gallery" :key="p.key" class="visit__photo" :class="`visit__photo--${p.key}`" :data-photo="p.depth">
        <img
          :src="cld(p.src, 'f_auto,q_auto,c_fill,w_700,h_700,g_auto')"
          :alt="p.alt"
          width="700"
          height="700"
          loading="lazy"
          decoding="async"
        />
      </li>
    </ul>

    <div class="visit__tail" data-tail>
      <ArtImage :src="cld(art.dogTail, 'f_auto,q_auto,w_1200')" alt="" ratio="2000 / 1116" hide-on-error />
    </div>
  </section>
</template>

<style scoped lang="scss">
.visit {
  position: relative;
  overflow: hidden;
  background: $mint;
  padding: $space-section 1.25rem 0;

  @include from('lg') {
    min-height: 118vh;
    padding: 0 2rem;
    @include flex(column, center, center);
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    @include flex(column, center, center);
    max-width: 760px;
    margin-inline: auto;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(column, center, center, 0.5rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include display(clamp(3.4rem, 1.6rem + 8vw, 9rem), $accent-deep);
  }

  &__handle {
    display: block;
    color: $ink;
    font-size: 0.62em;
    margin-top: 0.12em;
  }

  &__text {
    margin-top: 1.4rem;
    color: $ink-soft;
    max-width: 40ch;
  }

  &__actions {
    @include flex(row, center, center, 0.6rem 1.2rem);
    flex-wrap: wrap;
    margin-top: 1.6rem;
  }

  &__phone {
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    font-weight: 600;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 5px;
  }

  &__photos {
    list-style: none;
    position: relative;
    z-index: 1;
    @include flex(row, flex-start, center);
    flex-wrap: wrap;
    margin: 3rem auto 0;
    max-width: 520px;

    @include from('lg') {
      position: absolute;
      inset: 0;
      max-width: none;
      margin: 0;
      display: block;
    }
  }

  &__photo {
    width: 48%;
    border: 6px solid $surface;
    border-radius: 6px;
    box-shadow: $shadow-md;
    overflow: hidden;
    background: $surface;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
    }

    &--entrada {
      transform: rotate(-6deg);
    }

    &--estanterias {
      transform: rotate(5deg) translateY(1.5rem);
      margin-left: -2%;
    }

    &--neon {
      transform: rotate(4deg);
      margin-top: -0.5rem;
    }

    &--grooming {
      transform: rotate(-4deg) translateY(1rem);
      margin-left: -2%;
    }

    @include from('lg') {
      position: absolute;
      width: clamp(180px, 17vw, 280px);
      margin: 0;

      &--entrada {
        left: 4%;
        top: 9%;
      }

      &--estanterias {
        right: 5%;
        top: 14%;
      }

      &--neon {
        left: 11%;
        bottom: 13%;
      }

      &--grooming {
        right: 15%;
        bottom: 7%;
      }
    }
  }

  &__tail {
    position: relative;
    width: 80%;
    margin: 2rem 0 0 auto;
    pointer-events: none;

    @include from('lg') {
      position: absolute;
      z-index: 1;
      width: 36vw;
      left: 32%;
      bottom: -2%;
      margin: 0;
    }
  }
}
</style>
