<script setup lang="ts">
import { cld, contacts, photos, site, whatsappLink } from '@/config/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer__top">
      <div class="footer__brand">
        <RouterLink to="/" class="footer__logo" aria-label="Animall, ir al inicio">
          <img :src="cld(photos.logo, 'f_auto,q_auto,w_440')" alt="Animall" width="440" height="405" loading="lazy" />
        </RouterLink>
        <p class="footer__place">
          <i class="fa-solid fa-location-dot" aria-hidden="true"></i> {{ site.visit.title }}
        </p>
      </div>

      <div class="footer__cols">
        <nav class="footer__col" :aria-label="site.footer.menuTitle">
          <h2 class="footer__heading">{{ site.footer.menuTitle }}</h2>
          <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="footer__link">
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="footer__col">
          <h2 class="footer__heading">{{ site.catalogs.eyebrow }}</h2>
          <a v-for="item in site.catalogs.items" :key="item.key" :href="item.file" target="_blank" rel="noopener" class="footer__link">
            {{ item.title }}
          </a>
        </div>

        <div class="footer__col">
          <h2 class="footer__heading">{{ site.contact.eyebrow }}</h2>
          <a
            v-for="c in contacts"
            :key="c.key"
            :href="whatsappLink(undefined, c.whatsapp)"
            target="_blank"
            rel="noopener"
            class="footer__link footer__link--contact"
          >
            <span>{{ c.name }}</span>
            <small>{{ c.phone }}</small>
          </a>
        </div>
      </div>
    </div>

    <p class="footer__word" aria-hidden="true">{{ site.name }}</p>

    <div class="footer__bottom">
      <p>© {{ year }} {{ site.footer.rights }}</p>
      <RouterLink to="/login" class="footer__admin">{{ site.footer.admin }}</RouterLink>
      <p>
        {{ site.footer.madeBy }}
        <a :href="site.footer.madeByUrl" target="_blank" rel="noopener" class="footer__bakano">{{ site.footer.madeByName }}</a>
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
$rule: 1px solid rgba($accent-deep, 0.35);

.footer {
  background: $paper;
  color: $ink;
  overflow: hidden;
  border-top: $rule;

  &__top {
    @include container(1320px);
    @include flex(column, stretch, flex-start, 3rem);
    padding-block: 4rem 3rem;

    @include from('lg') {
      flex-direction: row;
      justify-content: space-between;
      gap: 4rem;
    }
  }

  &__brand {
    @include flex(column, flex-start, flex-start, 0.9rem);
  }

  &__logo img {
    width: clamp(150px, 18vw, 210px);
    height: auto;
  }

  &__place {
    @include eyebrow;
    color: $ink-soft;
    @include flex(row, center, flex-start, 0.5rem);
  }

  &__cols {
    @include flex-cards(180px, 2rem);

    @include from('lg') {
      flex: 0 1 760px;
    }
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.15rem);
    border-top: $rule;
    padding-top: 1rem;
  }

  &__heading {
    @include eyebrow;
    font-family: $font-principal;
    margin-bottom: 0.5rem;
  }

  &__link {
    @include display(1.6rem, $ink);
    line-height: 1;
    padding-block: 0.35rem;
    @include transition(color);
    @include focus-ring($accent-deep);

    &:hover {
      color: $accent-deep;
    }

    &--contact {
      @include flex(column, flex-start, flex-start, 0.15rem);

      small {
        font-family: $font-principal;
        font-size: $text-sm;
        color: $ink-soft;
        text-transform: none;
      }
    }
  }

  &__word {
    @include display(27vw, $accent-deep);
    line-height: 0.78;
    text-align: center;
    letter-spacing: -0.01em;
    margin-bottom: -0.04em;
    user-select: none;
  }

  &__bottom {
    @include container(1320px);
    @include flex(column, flex-start, space-between, 0.5rem);
    border-top: $rule;
    padding-block: 1.2rem 5.5rem;
    font-size: $text-xs;
    color: $ink-soft;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      padding-bottom: 1.2rem;
    }
  }

  &__admin {
    color: $ink-muted;
    text-decoration: underline;
    text-underline-offset: 3px;
    @include focus-ring($accent-deep);

    &:hover {
      color: $ink;
    }
  }

  &__bakano {
    font-weight: 700;
    color: $accent-deep;

    &:hover {
      color: $ink;
    }
  }
}
</style>
