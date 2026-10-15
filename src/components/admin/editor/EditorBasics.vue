<script setup lang="ts">
import { site } from '@/config/site'
import { adminCopy } from '@/components/admin/adminCopy'
import AdminSwitch from '@/components/admin/AdminSwitch.vue'
import type { ProductForm } from '@/composables/admin/useProductForm'
import type { CatalogKey } from '@/types'

// `form` y `suggestions` son reactivos del composable: se editan en su lugar.
const props = defineProps<{ form: ProductForm['form']; suggestions: ProductForm['suggestions'] }>()
const copy = adminCopy.editor
const f = props.form
const catalogs: CatalogKey[] = ['general', 'super-premium']

function toggleCatalog(key: CatalogKey) {
  f.catalogs = f.catalogs.includes(key) ? f.catalogs.filter((c) => c !== key) : [...f.catalogs, key]
}
</script>

<template>
  <section class="basics" aria-labelledby="ed-basic">
    <h3 id="ed-basic" class="basics__title">{{ copy.sectionBasic }}</h3>

    <div class="basics__field basics__field--full">
      <label for="ed-name">{{ copy.name }} *</label>
      <input id="ed-name" v-model="f.name" type="text" required autocomplete="off" />
    </div>

    <div class="basics__field">
      <label for="ed-brand">{{ copy.brand }}</label>
      <input id="ed-brand" v-model="f.brand" type="text" list="ed-brands" autocomplete="off" />
      <datalist id="ed-brands">
        <option v-for="b in suggestions.brands" :key="b" :value="b" />
      </datalist>
    </div>
    <div class="basics__field">
      <label for="ed-manufacturer">{{ copy.manufacturer }}</label>
      <input id="ed-manufacturer" v-model="f.manufacturer" type="text" autocomplete="off" />
    </div>

    <div class="basics__field basics__field--full">
      <label for="ed-category">{{ copy.category }}</label>
      <input
        id="ed-category"
        v-model="f.category"
        type="text"
        list="ed-categories"
        autocomplete="off"
        :placeholder="copy.categoryHint"
      />
      <datalist id="ed-categories">
        <option v-for="c in suggestions.categories" :key="c" :value="c" />
      </datalist>
    </div>

    <div class="basics__field">
      <label for="ed-species">{{ copy.species }}</label>
      <select id="ed-species" v-model="f.species">
        <option v-for="(label, value) in site.labels.species" :key="value" :value="value">{{ label }}</option>
      </select>
    </div>
    <div class="basics__field">
      <label for="ed-type">{{ copy.type }}</label>
      <select id="ed-type" v-model="f.type">
        <option v-for="(label, value) in site.labels.types" :key="value" :value="value">{{ label }}</option>
      </select>
    </div>

    <fieldset class="basics__field basics__catalogs">
      <legend>{{ copy.catalogs }}</legend>
      <button
        v-for="key in catalogs"
        :key="key"
        type="button"
        class="basics__chip"
        :class="{ 'is-on': f.catalogs.includes(key) }"
        :aria-pressed="f.catalogs.includes(key)"
        @click="toggleCatalog(key)"
      >
        <i :class="f.catalogs.includes(key) ? 'fa-solid fa-check' : 'fa-solid fa-plus'" aria-hidden="true"></i>
        {{ copy.catalogLabels[key] }}
      </button>
    </fieldset>
    <div class="basics__field">
      <label for="ed-sort">{{ copy.sortIndex }}</label>
      <input id="ed-sort" v-model.number="f.sortIndex" type="number" inputmode="numeric" />
      <small class="basics__hint">{{ copy.sortIndexHint }}</small>
    </div>

    <div class="basics__field basics__field--full basics__switches">
      <h3 class="basics__title">{{ copy.sectionVisibility }}</h3>
      <AdminSwitch v-model="f.isPublished" :label="copy.isPublished" show-label />
      <AdminSwitch v-model="f.isFeatured" :label="copy.isFeatured" show-label />
    </div>
  </section>
</template>

<style scoped lang="scss">
.basics {
  @include flex(row, flex-start, flex-start, 0.9rem 0.75rem);
  flex-wrap: wrap;

  &__title {
    flex: 1 1 100%;
    @include display(1.35rem, $ink);
  }

  &__field {
    flex: 1 1 100%;
    min-width: 0;
    border: none;

    @include from('sm') {
      flex: 1 1 calc(50% - 0.4rem);
    }

    &--full {
      flex-basis: 100% !important;
    }

    legend {
      font-size: 0.82rem;
      font-weight: 500;
      color: $ink-soft;
      margin-bottom: 0.35rem;
    }
  }

  &__catalogs {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__chip {
    @include flex(row, center, center, 0.4rem);
    min-height: 44px;
    padding: 0.4rem 0.9rem;
    border-radius: $radius-pill;
    border: 1.5px solid $line;
    background: $surface;
    font-size: 0.85rem;
    font-weight: 600;

    &.is-on {
      background: $night;
      border-color: $night;
      color: $accent;
    }
  }

  &__hint {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.74rem;
    color: $ink-muted;
  }

  &__switches {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding-top: 0.6rem;
    border-top: 1px solid $line;

    .basics__title {
      margin-bottom: 0.3rem;
    }
  }
}
</style>
