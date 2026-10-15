<script setup lang="ts">
import { ref } from 'vue'
import { cld, site } from '@/config/site'
import { MOTION_OK, gsap, useGsap } from '@/composables/home/useMotion'

const root = ref<HTMLElement | null>(null)

useGsap(root, (mm) => {
  mm.add(MOTION_OK, () => {
    gsap.utils.toArray<HTMLElement>('[data-cover]').forEach((el, i) => {
      gsap.from(el, {
        y: 140,
        rotation: i ? 14 : -14,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      })
    })
  })
})
</script>

<template>
  <section ref="root" class="catalogs" aria-labelledby="catalogs-title">
    <div class="catalogs__head">
      <p class="catalogs__eyebrow">
        {{ site.catalogs.eyebrow }} <i class="fa-solid fa-arrow-down-long" aria-hidden="true"></i>
      </p>
      <h2 id="catalogs-title" class="catalogs__title">{{ site.catalogs.title }}</h2>
    </div>

    <ul class="catalogs__list">
      <li v-for="(item, i) in site.catalogs.items" :key="item.key" class="catalogs__item" :class="`catalogs__item--${i}`">
        <figure class="catalogs__poster" data-cover>
          <a :href="item.file" target="_blank" rel="noopener" class="catalogs__cover">
            <img
              :src="cld(item.cover, 'f_auto,q_auto,w_720')"
              :alt="`Portada del catálogo ${item.title}`"
              width="1242"
              height="1756"
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption class="catalogs__caption">
            <h3 class="catalogs__name">{{ item.title }}</h3>
            <p class="catalogs__meta"><i class="fa-regular fa-file-pdf" aria-hidden="true"></i> {{ item.meta }}</p>
            <div class="catalogs__actions">
              <a :href="item.file" target="_blank" rel="noopener" class="btn btn--primary btn--dot">
                {{ site.catalogs.view }}
              </a>
              <a :href="item.file" download class="btn btn--ghost catalogs__dl">
                <i class="fa-solid fa-arrow-down" aria-hidden="true"></i> {{ site.catalogs.download }}
              </a>
            </div>
          </figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.catalogs {
  position: relative;
  overflow: hidden;
  background: $accent-deep;
  color: $paper;
  padding: $space-section 1.25rem;

  @include from('lg') {
    padding-inline: 2rem;
  }

  &__head {
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-soft;
    @include flex(column, center, center, 0.5rem);
    margin-bottom: 1rem;
  }

  &__title {
    @include display($display-lg, $paper);
  }

  &__list {
    list-style: none;
    max-width: 1100px;
    margin: 3.5rem auto 0;
    @include flex(column, center, flex-start, 4rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 3rem;
    }
  }

  &__item {
    width: min(100%, 380px);

    &--0 .catalogs__cover {
      transform: rotate(-4deg);
    }

    &--1 .catalogs__cover {
      transform: rotate(3deg);
    }

    &--1 {
      @include from('md') {
        margin-top: 5rem;
      }
    }
  }

  &__cover {
    display: block;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba($ink, 0.35);
    transition: transform 0.5s $ease;
    background: $paper;

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 1242 / 1756;
      object-fit: cover;
    }

    &:hover {
      transform: rotate(0deg) scale(1.03) !important;
    }
  }

  &__caption {
    margin-top: 1.6rem;
  }

  &__name {
    @include display(clamp(1.8rem, 1.4rem + 1.6vw, 2.6rem), $paper);
  }

  &__meta {
    @include eyebrow;
    color: $accent-soft;
    margin-top: 0.5rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 1.2rem;
  }

  &__dl {
    color: $paper;

    &:hover {
      background: $paper;
      border-color: $paper;
      color: $ink;
    }
  }
}
</style>
