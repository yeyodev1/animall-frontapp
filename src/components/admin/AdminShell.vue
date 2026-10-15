<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { adminCopy } from '@/components/admin/adminCopy'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTabBar from '@/components/admin/AdminTabBar.vue'
import { useAdminSession } from '@/composables/admin/useAdminSession'
import { useAdminStats } from '@/composables/admin/useAdminStats'

const nav = adminCopy.nav
const { initials, logout } = useAdminSession()
const { stats, refresh } = useAdminStats()

onMounted(() => {
  if (!stats.value) refresh()
})
</script>

<template>
  <div class="shell">
    <header class="shell__top">
      <RouterLink to="/admin" class="shell__brand">
        <span class="shell__word">Animall</span>
        <span class="shell__tag">Admin</span>
      </RouterLink>
      <div class="shell__actions">
        <a href="/" class="shell__icon-btn" :aria-label="nav.store" target="_blank" rel="noopener">
          <i class="fa-solid fa-store" aria-hidden="true"></i>
        </a>
        <span class="shell__avatar" aria-hidden="true">{{ initials }}</span>
        <button type="button" class="shell__icon-btn" :aria-label="nav.logout" @click="logout">
          <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
        </button>
      </div>
    </header>

    <AdminSidebar class="shell__side" />

    <main class="shell__main">
      <slot />
    </main>

    <AdminTabBar class="shell__tabs" />
  </div>
</template>

<style scoped lang="scss">
.shell {
  min-height: 100vh;
  min-height: 100dvh;
  background: $paper;

  &__top {
    position: sticky;
    top: 0;
    z-index: 50;
    @include flex(row, center, space-between);
    height: 60px;
    padding-inline: 1rem 0.5rem;
    background: $night;
    color: $paper;

    @include from('lg') {
      display: none;
    }
  }

  &__brand {
    @include flex(row, center, flex-start, 0.55rem);
    border-radius: $radius-sm;
  }

  &__word {
    @include display(1.9rem, $paper);
    line-height: 1;
    padding-top: 0.2rem;
  }

  &__tag {
    font-family: $font-display;
    font-size: 0.95rem;
    line-height: 1;
    padding: 0.28rem 0.45rem 0.18rem;
    border-radius: 6px;
    background: $accent;
    color: $ink;
  }

  &__actions {
    @include flex(row, center, flex-end, 0.2rem);
  }

  &__avatar {
    width: 32px;
    height: 32px;
    margin-inline: 0.3rem;
    border-radius: 50%;
    background: $mint;
    color: $ink;
    font-weight: 800;
    font-size: 0.75rem;
    @include flex(row, center, center);
  }

  &__icon-btn {
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    @include flex(row, center, center);
    color: $paper;
    @include transition(background);

    &:hover {
      background: rgba($paper, 0.1);
    }
  }

  &__side {
    display: none !important;

    @include from('lg') {
      display: flex !important;
    }
  }

  &__main {
    max-width: 1240px;
    padding: 1.25rem 1rem calc(92px + env(safe-area-inset-bottom));

    @include from('md') {
      padding-inline: 1.75rem;
    }

    @include from('lg') {
      margin-left: 248px;
      padding: 2.2rem 2.5rem 3rem;
    }
  }

  &__tabs {
    @include from('lg') {
      display: none !important;
    }
  }
}
</style>
