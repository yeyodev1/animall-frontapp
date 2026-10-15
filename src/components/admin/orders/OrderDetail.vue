<script setup lang="ts">
import { computed } from 'vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { customerWhatsapp, statusLabel, thumbUrl } from '@/composables/admin/adminFormat'
import { ORDER_STATUSES } from '@/composables/admin/useAdminOrders'
import { formatCents } from '@/utils/format'
import type { Order, OrderStatus } from '@/types'

const props = defineProps<{ order: Order; updating: boolean }>()
const emit = defineEmits<{ status: [status: OrderStatus]; copy: [] }>()

const copy = adminCopy.orders
const savings = computed(() => Math.max(0, props.order.subtotalPvp - props.order.total))
const whatsapp = computed(() => customerWhatsapp(props.order))
const icons: Record<OrderStatus, string> = {
  nueva: 'fa-solid fa-inbox',
  confirmada: 'fa-solid fa-circle-check',
  entregada: 'fa-solid fa-truck',
  cancelada: 'fa-solid fa-ban',
}
</script>

<template>
  <div class="detail">
    <ul class="detail__items">
      <li v-for="(item, i) in order.items" :key="`${item.slug}-${item.size}-${i}`" class="detail__item">
        <span class="detail__thumb">
          <img v-if="item.image" :src="thumbUrl(item.image, 96)" alt="" loading="lazy" width="44" height="44" />
          <i v-else class="fa-regular fa-image" aria-hidden="true"></i>
        </span>
        <span class="detail__name">
          <strong>{{ item.qty }} × {{ item.name }}</strong>
          <small>{{ item.size }}<template v-if="item.promo"> · {{ item.promo }}</template></small>
        </span>
        <span class="detail__price">
          <s v-if="item.pvp > item.pvc">{{ formatCents(item.pvp * item.qty) }}</s>
          <strong>{{ formatCents(item.pvc * item.qty) }}</strong>
        </span>
      </li>
    </ul>

    <dl class="detail__totals">
      <div><dt>{{ copy.subtotal }}</dt><dd>{{ formatCents(order.subtotalPvp) }}</dd></div>
      <div v-if="savings"><dt>{{ copy.savings }}</dt><dd class="detail__save">−{{ formatCents(savings) }}</dd></div>
      <div class="detail__grand"><dt>{{ copy.total }}</dt><dd>{{ formatCents(order.total) }}</dd></div>
    </dl>

    <p class="detail__contact">
      <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ copy.phone }}: <strong>{{ order.customer.phone }}</strong>
    </p>
    <p v-if="order.customer.note" class="detail__note">
      <strong>{{ copy.note }}:</strong> {{ order.customer.note }}
    </p>

    <div class="detail__actions">
      <a :href="whatsapp" target="_blank" rel="noopener" class="btn btn--primary detail__wa">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ copy.whatsapp }}
      </a>
      <button type="button" class="btn btn--ghost" @click="emit('copy')">
        <i class="fa-regular fa-copy" aria-hidden="true"></i> {{ copy.copy }}
      </button>
    </div>

    <fieldset class="detail__status" :disabled="updating" :aria-busy="updating">
      <legend>{{ copy.changeStatus }}</legend>
      <button
        v-for="s in ORDER_STATUSES"
        :key="s"
        type="button"
        class="detail__status-btn"
        :class="[`detail__status-btn--${s}`, { 'is-current': order.status === s }]"
        :aria-pressed="order.status === s"
        @click="emit('status', s)"
      >
        <i :class="icons[s]" aria-hidden="true"></i>
        {{ statusLabel(s) }}
      </button>
    </fieldset>
  </div>
</template>

<style scoped lang="scss">
.detail {
  @include flex(column, stretch, flex-start, 1rem);
  padding: 0 1rem 1.1rem;
  border-top: 1px dashed $line;
  padding-top: 1rem;

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.55rem);
  }

  &__item {
    @include flex(row, center, flex-start, 0.7rem);
  }

  &__thumb {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    border: 1px solid $line;
    overflow: hidden;
    color: $ink-muted;
    @include flex(row, center, center);

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__name {
    flex: 1;
    min-width: 0;
    @include flex(column, flex-start, flex-start);
    line-height: 1.3;

    strong {
      font-size: 0.88rem;
    }

    small {
      font-size: 0.76rem;
      color: $ink-muted;
    }
  }

  &__price {
    flex: none;
    @include flex(column, flex-end, center);
    font-variant-numeric: tabular-nums;
    line-height: 1.2;

    s {
      font-size: 0.72rem;
      color: $ink-muted;
    }
  }

  &__totals {
    @include flex(column, stretch, flex-start, 0.25rem);
    padding: 0.8rem 0.9rem;
    border-radius: $radius-sm;
    background: $paper;
    font-variant-numeric: tabular-nums;

    div {
      @include flex(row, center, space-between);
      font-size: 0.88rem;
    }

    dt {
      color: $ink-soft;
    }
  }

  &__save {
    color: $accent-deep;
    font-weight: 700;
  }

  &__grand {
    margin-top: 0.2rem;
    padding-top: 0.4rem;
    border-top: 1px solid $line;

    dt,
    dd {
      font-weight: 800;
      color: $ink !important;
      font-size: 1rem;
    }
  }

  &__contact,
  &__note {
    font-size: 0.88rem;
    color: $ink-soft;
  }

  &__note {
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
    background: $warning-bg;
    color: $ink;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;

    .btn {
      flex: 1 1 180px;
      font-size: 1.05rem;
    }
  }

  &__status {
    border: none;
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;

    legend {
      width: 100%;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $ink-soft;
      margin-bottom: 0.45rem;
    }
  }

  &__status-btn {
    flex: 1 1 calc(50% - 0.2rem);
    @include flex(row, center, center, 0.45rem);
    min-height: 44px;
    padding: 0.45rem 0.8rem;
    border-radius: $radius-pill;
    border: 1.5px solid $line;
    background: $surface;
    font-size: 0.86rem;
    font-weight: 700;

    @include from('md') {
      flex: 0 1 auto;
    }

    &:hover:not(:disabled) {
      border-color: $ink;
    }

    &.is-current {
      background: $night;
      border-color: $night;
      color: $paper;
      cursor: default;
    }

    &--cancelada:not(.is-current) {
      color: #ae2a1d;
    }

    &:disabled {
      opacity: 0.6;
    }
  }
}
</style>
