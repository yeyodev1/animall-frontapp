<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { adminCopy } from '@/components/admin/adminCopy'

const copy = adminCopy.dashboard
const items = [
  { to: { path: '/admin/productos', query: { nuevo: '1' } }, label: copy.shortcutNew, hint: copy.shortcutNewHint, icon: 'fa-solid fa-plus' },
  { to: { path: '/admin/pedidos', query: { estado: 'nueva' } }, label: copy.shortcutOrders, hint: copy.shortcutOrdersHint, icon: 'fa-solid fa-receipt' },
  { to: { path: '/admin/productos' }, label: copy.shortcutProducts, hint: copy.shortcutProductsHint, icon: 'fa-solid fa-tags' },
]
</script>

<template>
  <section class="shortcuts" aria-labelledby="shortcuts-title">
    <h2 id="shortcuts-title" class="shortcuts__title">{{ copy.shortcuts }}</h2>
    <div class="shortcuts__list">
      <RouterLink v-for="item in items" :key="item.label" :to="item.to" class="shortcuts__item">
        <span class="shortcuts__icon" aria-hidden="true"><i :class="item.icon"></i></span>
        <span class="shortcuts__text">
          <strong>{{ item.label }}</strong>
          <small>{{ item.hint }}</small>
        </span>
        <i class="fa-solid fa-chevron-right shortcuts__chev" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.shortcuts {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__title {
    @include display($text-xl, $ink);
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.85rem);
    padding: 0.85rem 1rem;
    min-height: 68px;
    border-radius: 14px;
    background: $mint;
    border: 1px solid $mint-strong;
    @include transition(background);

    &:hover {
      background: $mint-strong;
    }

    &:first-child {
      background: $accent;
      border-color: $accent;

      .shortcuts__icon {
        background: $ink;
        color: $accent;
      }
    }
  }

  &__icon {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $surface;
    color: $accent-deep;
    @include flex(row, center, center);
  }

  &__text {
    @include flex(column, flex-start, flex-start, 0.05rem);
    line-height: 1.3;

    strong {
      font-size: 0.95rem;
    }

    small {
      font-size: 0.78rem;
      color: $ink-soft;
    }
  }

  &__chev {
    margin-left: auto;
    font-size: 0.8rem;
  }
}
</style>
