<script setup lang="ts">
import { computed } from 'vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import OrderDetail from './OrderDetail.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { storeName } from '@/composables/admin/adminFormat'
import { formatCents } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

const props = defineProps<{ order: Order; open: boolean; updating: boolean }>()
const emit = defineEmits<{ toggle: []; status: [status: OrderStatus]; copy: [] }>()

const copy = adminCopy.orders
const when = computed(() =>
  new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(props.order.createdAt),
  ),
)
const units = computed(() => props.order.items.reduce((n, i) => n + i.qty, 0))
</script>

<template>
  <article class="order" :class="[`order--${order.status}`, { 'is-open': open }]">
    <button
      type="button"
      class="order__summary"
      :aria-expanded="open"
      :aria-controls="`order-${order._id}`"
      @click="emit('toggle')"
    >
      <span class="order__line">
        <strong class="order__code">{{ order.code }}</strong>
        <StatusPill :status="order.status" />
      </span>
      <span class="order__line order__line--main">
        <span class="order__customer">
          <strong>{{ order.customer.name }}</strong>
          <small>{{ copy.wroteTo }} {{ storeName(order.store) }} · {{ copy.items(units) }}</small>
        </span>
        <strong class="order__total">{{ formatCents(order.total) }}</strong>
      </span>
      <span class="order__line order__line--meta">
        <time :datetime="order.createdAt">{{ when }}</time>
        <span class="order__toggle">
          {{ open ? copy.collapse : copy.expand }}
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </span>
      </span>
    </button>

    <OrderDetail
      v-if="open"
      :id="`order-${order._id}`"
      :order="order"
      :updating="updating"
      @status="(s) => emit('status', s)"
      @copy="emit('copy')"
    />
  </article>
</template>

<style scoped lang="scss">
.order {
  @include card;
  overflow: hidden;
  border-left: 5px solid $line;
  @include transition(box-shadow);

  &--nueva {
    border-left-color: $ball;
  }

  &--confirmada {
    border-left-color: $info;
  }

  &--entregada {
    border-left-color: $accent-deep;
  }

  &.is-open {
    box-shadow: $shadow-md;
  }

  &__summary {
    width: 100%;
    @include flex(column, stretch, flex-start, 0.45rem);
    padding: 0.9rem 1rem;
    text-align: left;

    &:hover .order__toggle {
      color: $ink;
    }
  }

  &__line {
    @include flex(row, center, space-between, 0.75rem);

    &--meta {
      font-size: 0.78rem;
      color: $ink-muted;
    }
  }

  &__code {
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
  }

  &__customer {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;
    line-height: 1.3;

    strong {
      font-size: 1rem;
    }

    small {
      font-size: 0.8rem;
      color: $ink-soft;
    }
  }

  &__total {
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    flex: none;
    font-variant-numeric: tabular-nums;
  }

  &__toggle {
    @include flex(row, center, flex-end, 0.35rem);
    font-weight: 600;
    color: $ink-soft;

    i {
      transition: transform 0.25s $ease;

      .is-open & {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
