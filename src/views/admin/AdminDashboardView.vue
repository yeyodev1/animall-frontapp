<script setup lang="ts">
import { computed } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import StatCard from '@/components/admin/dashboard/StatCard.vue'
import RecentOrders from '@/components/admin/dashboard/RecentOrders.vue'
import Shortcuts from '@/components/admin/dashboard/Shortcuts.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { useAdminSession } from '@/composables/admin/useAdminSession'
import { useDashboard } from '@/composables/admin/useDashboard'
import { formatCents } from '@/utils/format'

const copy = adminCopy.dashboard
const { firstName } = useAdminSession()
const { stats, statsLoading, statsError, recent, recentLoading, recentError, reload } = useDashboard()

const loadingStats = computed(() => statsLoading.value && !stats.value)

const secondary = computed(() => {
  const s = stats.value
  return [
    { label: copy.confirmed, value: s?.orders.confirmada ?? 0, icon: 'fa-solid fa-circle-check', to: '/admin/pedidos?estado=confirmada' },
    { label: copy.delivered, value: s?.orders.entregada ?? 0, icon: 'fa-solid fa-truck', to: '/admin/pedidos?estado=entregada' },
    {
      label: copy.revenue,
      value: formatCents(s?.revenue ?? 0),
      icon: 'fa-solid fa-sack-dollar',
      hint: copy.revenueHint(s?.ordersCount ?? 0),
    },
    {
      label: copy.products,
      value: s?.products ?? 0,
      icon: 'fa-solid fa-box-open',
      hint: copy.productsHint(s?.unpublished ?? 0),
      to: '/admin/productos',
    },
  ]
})
</script>

<template>
  <AdminShell>
    <AdminPageHeader :eyebrow="copy.eyebrow" :title="copy.greeting(firstName)" :lead="copy.lead" />

    <AdminEmpty
      v-if="statsError && !stats"
      tone="error"
      icon="fa-solid fa-plug-circle-xmark"
      :message="`${copy.loadError}: ${statsError}`"
      class="dash__error"
    >
      <button type="button" class="btn btn--dark" @click="reload">{{ copy.retry }}</button>
    </AdminEmpty>

    <div v-else class="dash__stats">
      <StatCard
        class="dash__hero"
        highlight
        :label="copy.newOrders"
        :value="stats?.orders.nueva ?? 0"
        :hint="copy.newOrdersHint"
        icon="fa-solid fa-bell"
        to="/admin/pedidos?estado=nueva"
        :loading="loadingStats"
      />
      <div class="dash__grid">
        <StatCard v-for="card in secondary" :key="card.label" v-bind="card" :loading="loadingStats" />
      </div>
    </div>

    <div class="dash__cols">
      <RecentOrders class="dash__recent" :orders="recent" :loading="recentLoading" :error="recentError" />
      <Shortcuts class="dash__shortcuts" />
    </div>
  </AdminShell>
</template>

<style scoped lang="scss">
.dash {
  &__error {
    margin-bottom: 2rem;
  }

  &__stats {
    @include flex(column, stretch, flex-start, 0.75rem);
    margin-bottom: 2rem;

    @include from('lg') {
      flex-direction: row;
    }
  }

  &__hero {
    @include from('lg') {
      flex: 0 0 280px;
    }
  }

  &__grid {
    flex: 1;
    @include flex-cards(140px, 0.75rem);

    @include from('md') {
      > * {
        flex-basis: 180px;
      }
    }
  }

  &__cols {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__recent {
    flex: 1 1 60%;
    min-width: 0;
  }

  &__shortcuts {
    flex: 1 1 34%;
  }
}
</style>
