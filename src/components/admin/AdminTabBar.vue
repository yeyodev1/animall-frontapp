<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { adminCopy } from '@/components/admin/adminCopy'
import { adminLinks } from '@/components/admin/adminNav'
import { useAdminStats } from '@/composables/admin/useAdminStats'

const { newOrders } = useAdminStats()
</script>

<template>
  <nav class="tabs" :aria-label="adminCopy.nav.menuLabel">
    <RouterLink
      v-for="link in adminLinks"
      :key="link.to"
      :to="link.to"
      class="tabs__tab"
      :exact-active-class="link.exact ? 'is-active' : ''"
      :active-class="link.exact ? '' : 'is-active'"
    >
      <span class="tabs__icon">
        <i :class="link.icon" aria-hidden="true"></i>
        <span v-if="link.badge && newOrders" class="tabs__badge">{{ newOrders }}</span>
      </span>
      <span>{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.tabs {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 50;
  @include flex(row, stretch, space-around);
  padding: 0.35rem 0.5rem calc(0.35rem + env(safe-area-inset-bottom));
  background: $surface;
  border-top: 1px solid $line;
  box-shadow: 0 -6px 20px rgba($ink, 0.06);

  &__tab {
    flex: 1;
    @include flex(column, center, center, 0.2rem);
    min-height: 56px;
    border-radius: $radius-sm;
    font-size: 0.74rem;
    font-weight: 600;
    color: $ink-muted;

    &.is-active {
      color: $ink;

      .tabs__icon {
        background: $accent;
      }
    }
  }

  &__icon {
    position: relative;
    @include flex(row, center, center);
    width: 54px;
    height: 30px;
    border-radius: $radius-pill;
    font-size: 1.05rem;
    @include transition(background);
  }

  &__badge {
    position: absolute;
    top: -6px;
    right: 2px;
    min-width: 19px;
    height: 19px;
    padding-inline: 5px;
    border-radius: $radius-pill;
    background: $ink;
    color: $accent;
    font-size: 0.66rem;
    font-weight: 800;
    @include flex(row, center, center);
  }
}
</style>
