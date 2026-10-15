<script setup lang="ts">
import { computed } from 'vue'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { minPrice, thumbUrl } from '@/composables/admin/adminFormat'
import { site } from '@/config/site'
import { formatCents } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; busyPublished?: boolean; busyFeatured?: boolean }>()
const emit = defineEmits<{ toggle: [field: 'isPublished' | 'isFeatured']; edit: []; remove: [] }>()

const copy = adminCopy.products
const thumb = computed(() => thumbUrl(props.product.image?.url))
const price = computed(() => minPrice(props.product))
const meta = computed(() =>
  [props.product.brand, site.labels.species[props.product.species], copy.variants(props.product.variants.length)]
    .filter(Boolean)
    .join(' · '),
)
</script>

<template>
  <tr class="row" :class="{ 'row--hidden': !product.isPublished }">
    <td class="row__product">
      <div class="row__cell">
        <span class="row__thumb">
          <img v-if="thumb" :src="thumb" :alt="product.name" loading="lazy" width="56" height="56" />
          <i v-else class="fa-regular fa-image" :aria-label="copy.noImage"></i>
        </span>
        <span class="row__text">
          <button type="button" class="row__name" @click="emit('edit')">{{ product.name }}</button>
          <span class="row__meta">{{ meta }}</span>
          <span v-if="price !== null" class="row__inline-price">
            {{ copy.from }} <strong>{{ formatCents(price) }}</strong>
          </span>
        </span>
      </div>
    </td>
    <td class="row__price">
      <div class="row__cell row__cell--price">
        <template v-if="price !== null">
          <small>{{ copy.from }}</small>
          <strong>{{ formatCents(price) }}</strong>
        </template>
        <span v-else class="row__none">—</span>
      </div>
    </td>
    <td class="row__switch">
      <AdminSwitch
        :model-value="product.isPublished"
        :label="copy.publishedOn"
        show-label
        :busy="busyPublished"
        @update:model-value="emit('toggle', 'isPublished')"
      />
    </td>
    <td class="row__switch">
      <AdminSwitch
        :model-value="product.isFeatured"
        :label="copy.featuredOn"
        show-label
        :busy="busyFeatured"
        @update:model-value="emit('toggle', 'isFeatured')"
      />
    </td>
    <td class="row__actions">
      <div class="row__cell row__cell--actions">
        <button type="button" class="row__icon" :aria-label="`${copy.edit} ${product.name}`" @click="emit('edit')">
          <i class="fa-solid fa-pen" aria-hidden="true"></i>
        </button>
        <button
          type="button"
          class="row__icon row__icon--danger"
          :aria-label="`${copy.remove} ${product.name}`"
          @click="emit('remove')"
        >
          <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped lang="scss">
// Mobile: cada fila es una tarjeta. Desde lg vuelve a ser fila de tabla.
.row {
  @include card;
  @include flex(row, center, flex-start, 0.4rem 0.75rem);
  flex-wrap: wrap;
  padding: 0.85rem 0.9rem 0.6rem;

  @include from('lg') {
    display: table-row;
    background: none;
    border: none;
    border-radius: 0;
    padding: 0;

    > td {
      display: table-cell !important;
      vertical-align: middle;
      padding: 0.65rem 0.8rem;
      border-bottom: 1px solid $line;
    }
  }

  &--hidden &__thumb img {
    opacity: 0.5;
  }

  // Mobile: [foto · nombre · precio] [editar · borrar] / [switches]
  &__product {
    flex: 1 1 calc(100% - 100px);
    min-width: 0;
  }

  &__cell {
    @include flex(row, center, flex-start, 0.75rem);

    &--price {
      flex-direction: column;
      align-items: flex-end;
      gap: 0;
    }

    &--actions {
      justify-content: flex-end;
      gap: 0.15rem;
    }
  }

  &__inline-price {
    font-size: 0.8rem;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;

    strong {
      color: $ink;
      font-size: 0.95rem;
    }

    @include from('lg') {
      display: none;
    }
  }

  &__thumb {
    flex: none;
    width: 56px;
    height: 56px;
    border-radius: 10px;
    background: $surface;
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

  &__text {
    @include flex(column, flex-start, flex-start, 0.15rem);
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    font-size: 0.93rem;
    line-height: 1.25;
    text-align: left;
    padding: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    &:hover {
      color: $accent-deep;
      text-decoration: underline;
    }
  }

  &__meta {
    font-size: 0.76rem;
    color: $ink-muted;
  }

  &__price {
    display: none;
    text-align: right;
    white-space: nowrap;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;

    small {
      font-size: 0.7rem;
      color: $ink-muted;
    }

    strong {
      font-size: 1rem;
    }
  }

  &__none {
    color: $ink-muted;
  }

  &__switch {
    flex: none;
    order: 3;

    & + & {
      margin-right: auto;
    }

    @include from('lg') {
      :deep(.switch__label) {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    }
  }

  &__actions {
    order: 2;
    flex: none;
    align-self: flex-start;
    margin: -0.4rem -0.4rem 0 0;

    @include from('lg') {
      margin: 0;
      width: 110px;
    }
  }

  &__icon {
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    color: $ink-soft;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    @include transition(background);

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--danger:hover {
      background: $danger-bg;
      color: $danger;
    }
  }
}
</style>
