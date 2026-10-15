<script setup lang="ts">
import AdminShell from '@/components/admin/AdminShell.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import OrderTabs from '@/components/admin/orders/OrderTabs.vue'
import OrderCard from '@/components/admin/orders/OrderCard.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { useAdminOrders } from '@/composables/admin/useAdminOrders'

const copy = adminCopy.orders
const { status, tabs, page, pages, items, loading, error, expanded, updating, load, goTo, toggleExpanded, setStatus, copyOrder } =
  useAdminOrders()
</script>

<template>
  <AdminShell>
    <AdminPageHeader :eyebrow="copy.eyebrow" :title="copy.title" />

    <OrderTabs v-model="status" :tabs="tabs" />

    <div role="tabpanel" :aria-busy="loading">
      <ul v-if="loading && !items.length" class="orders__skeleton" aria-hidden="true">
        <li v-for="n in 4" :key="n"></li>
      </ul>
      <AdminEmpty v-else-if="error" tone="error" icon="fa-solid fa-plug-circle-xmark" :message="`${copy.loadError}: ${error}`">
        <button type="button" class="btn btn--dark" @click="load">{{ adminCopy.dashboard.retry }}</button>
      </AdminEmpty>
      <AdminEmpty v-else-if="!items.length" icon="fa-solid fa-receipt" :message="status ? copy.empty : copy.emptyAll" />
      <ul v-else class="orders__list" :class="{ 'is-loading': loading }">
        <li v-for="order in items" :key="order._id">
          <OrderCard
            :order="order"
            :open="expanded === order._id"
            :updating="Boolean(updating[order._id])"
            @toggle="toggleExpanded(order._id)"
            @status="(s) => setStatus(order, s)"
            @copy="copyOrder(order)"
          />
        </li>
      </ul>
    </div>

    <AdminPager :page="page" :pages="pages" @go="goTo" />
  </AdminShell>
</template>

<style scoped lang="scss">
.orders {
  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.65rem);
    max-width: 860px;

    &.is-loading {
      opacity: 0.55;
    }
  }

  &__skeleton {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.65rem);
    max-width: 860px;

    li {
      height: 118px;
      border-radius: 14px;
      background: $sand;
      animation: pulse 1.2s ease-in-out infinite alternate;
    }
  }
}

@keyframes pulse {
  to {
    opacity: 0.5;
  }
}
</style>
