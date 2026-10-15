<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { adminCopy } from '@/components/admin/adminCopy'
import { adminLinks } from '@/components/admin/adminNav'
import { useAdminSession } from '@/composables/admin/useAdminSession'
import { useAdminStats } from '@/composables/admin/useAdminStats'

const nav = adminCopy.nav
const { displayName, initials, user, logout } = useAdminSession()
const { newOrders } = useAdminStats()
</script>

<template>
  <aside class="side">
    <RouterLink to="/admin" class="side__brand">
      <span class="side__word">Animall</span>
      <span class="side__tag">Admin</span>
    </RouterLink>

    <nav class="side__nav" :aria-label="nav.menuLabel">
      <RouterLink
        v-for="link in adminLinks"
        :key="link.to"
        :to="link.to"
        class="side__link"
        :exact-active-class="link.exact ? 'is-active' : ''"
        :active-class="link.exact ? '' : 'is-active'"
      >
        <i :class="link.icon" aria-hidden="true"></i>
        <span>{{ link.label }}</span>
        <span v-if="link.badge && newOrders" class="side__badge">{{ newOrders }}</span>
      </RouterLink>
    </nav>

    <div class="side__foot">
      <a href="/" class="side__link" target="_blank" rel="noopener">
        <i class="fa-solid fa-store" aria-hidden="true"></i>
        <span>{{ nav.store }}</span>
        <i class="fa-solid fa-arrow-up-right-from-square side__ext" aria-hidden="true"></i>
      </a>
      <div class="side__user">
        <span class="side__avatar" aria-hidden="true">{{ initials }}</span>
        <span class="side__user-text">
          <strong>{{ displayName }}</strong>
          <small>{{ user?.email }}</small>
        </span>
      </div>
      <button type="button" class="side__link" @click="logout">
        <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
        <span>{{ nav.logout }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.side {
  position: fixed;
  inset: 0 auto 0 0;
  width: 248px;
  @include flex(column, stretch, flex-start, 2rem);
  padding: 1.6rem 1rem 1.2rem;
  background: $night;
  color: $paper;
  z-index: 50;
  overflow-y: auto;

  &__brand {
    @include flex(row, center, flex-start, 0.6rem);
    padding-inline: 0.5rem;
    border-radius: $radius-sm;

  }

  &__word {
    @include display(2.3rem, $paper);
    line-height: 1;
    padding-top: 0.2rem;
  }

  &__tag {
    font-family: $font-display;
    font-size: 1rem;
    line-height: 1;
    padding: 0.3rem 0.5rem 0.2rem;
    border-radius: 6px;
    background: $accent;
    color: $ink;
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.25rem);
  }

  &__link {
    @include flex(row, center, flex-start, 0.8rem);
    width: 100%;
    min-height: 46px;
    padding: 0.6rem 0.85rem;
    border-radius: $radius-sm;
    font-weight: 600;
    font-size: 0.95rem;
    color: rgba($paper, 0.78);
    text-align: left;
    @include transition(background);

    i {
      width: 1.2rem;
      text-align: center;
    }

    &:hover {
      background: rgba($paper, 0.08);
      color: $paper;
    }

    &.is-active {
      background: $accent;
      color: $ink;
    }
  }

  &__ext {
    margin-left: auto;
    font-size: 0.7rem;
    opacity: 0.6;
  }

  &__badge {
    margin-left: auto;
    min-width: 22px;
    height: 22px;
    padding-inline: 6px;
    border-radius: $radius-pill;
    background: $ball;
    color: $ink;
    font-size: 0.72rem;
    font-weight: 800;
    @include flex(row, center, center);

    .is-active & {
      background: $ink;
      color: $accent;
    }
  }

  &__foot {
    margin-top: auto;
    @include flex(column, stretch, flex-start, 0.4rem);
    border-top: 1px solid rgba($paper, 0.12);
    padding-top: 1rem;
  }

  &__user {
    @include flex(row, center, flex-start, 0.7rem);
    padding: 0.6rem 0.85rem;
    min-width: 0;
  }

  &__avatar {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: $mint;
    color: $ink;
    font-weight: 800;
    font-size: 0.8rem;
    @include flex(row, center, center);
  }

  &__user-text {
    @include flex(column, flex-start, flex-start);
    min-width: 0;
    line-height: 1.25;

    strong {
      font-size: 0.9rem;
    }

    small {
      font-size: 0.75rem;
      color: rgba($paper, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 170px;
    }
  }
}
</style>
