<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StatusPill from '@/components/admin/StatusPill.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { storeName } from '@/composables/admin/adminFormat'
import { formatCents, formatDate } from '@/utils/format'
import type { Order } from '@/types'

defineProps<{ orders: Order[]; loading: boolean; error: string }>()
const copy = adminCopy.dashboard
</script>

<template>
  <section class="recent" aria-labelledby="recent-title">
    <div class="recent__head">
      <h2 id="recent-title" class="recent__title">{{ copy.recent }}</h2>
      <RouterLink to="/admin/pedidos" class="recent__all">
        {{ copy.seeAll }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </RouterLink>
    </div>

    <ul v-if="loading" class="recent__list" aria-hidden="true">
      <li v-for="n in 3" :key="n" class="recent__item recent__item--skeleton"></li>
    </ul>
    <AdminEmpty v-else-if="error" tone="error" icon="fa-solid fa-plug-circle-xmark" :message="error" />
    <AdminEmpty v-else-if="!orders.length" icon="fa-solid fa-receipt" :message="copy.noOrders" />
    <ul v-else class="recent__list">
      <li v-for="order in orders" :key="order._id">
        <RouterLink :to="{ path: '/admin/pedidos', query: { open: order._id } }" class="recent__item">
          <span class="recent__main">
            <strong class="recent__code">{{ order.code }}</strong>
            <span class="recent__meta">
              {{ order.customer.name }} · {{ storeName(order.store) }} · {{ formatDate(order.createdAt) }}
            </span>
          </span>
          <span class="recent__side">
            <strong class="recent__total">{{ formatCents(order.total) }}</strong>
            <StatusPill :status="order.status" />
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.recent {
  @include flex(column, stretch, flex-start, 0.8rem);

  &__head {
    @include flex(row, baseline, space-between, 1rem);
  }

  &__title {
    @include display($text-xl, $ink);
  }

  &__all {
    font-size: 0.85rem;
    font-weight: 700;
    color: $accent-deep;
    padding: 0.4rem 0;
  }

  &__list {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.5rem);
  }

  &__item {
    @include card;
    @include flex(row, center, space-between, 0.8rem);
    padding: 0.85rem 1rem;
    min-height: 68px;
    @include transition(border-color);

    &:hover {
      border-color: $ink;
    }

    &--skeleton {
      background: $sand;
      border-color: $sand;
    }
  }

  &__main {
    @include flex(column, flex-start, flex-start, 0.15rem);
    min-width: 0;
  }

  &__code {
    font-size: 0.95rem;
    font-variant-numeric: tabular-nums;
  }

  &__meta {
    font-size: 0.78rem;
    color: $ink-muted;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  &__side {
    flex: none;
    @include flex(column, flex-end, center, 0.3rem);
  }

  &__total {
    font-variant-numeric: tabular-nums;
    font-size: 0.95rem;
  }
}
</style>
