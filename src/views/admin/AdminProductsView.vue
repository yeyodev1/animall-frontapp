<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminEmpty from '@/components/admin/AdminEmpty.vue'
import AdminPager from '@/components/admin/AdminPager.vue'
import ProductToolbar from '@/components/admin/products/ProductToolbar.vue'
import ProductList from '@/components/admin/products/ProductList.vue'
import ProductEditor from '@/components/admin/editor/ProductEditor.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { useAdminProducts } from '@/composables/admin/useAdminProducts'
import type { Product } from '@/types'

const copy = adminCopy.products
const route = useRoute()
const router = useRouter()
const { filters, page, pages, total, items, loading, error, busy, hasFilters, load, goTo, clearFilters, toggle, remove, upsert } =
  useAdminProducts()

const editorOpen = ref(false)
const editing = ref<Product | null>(null)
const toDelete = ref<Product | null>(null)

function openEditor(product: Product | null) {
  editing.value = product
  editorOpen.value = true
}

function closeEditor() {
  editorOpen.value = false
  if (route.query.nuevo) router.replace({ query: {} })
}

async function confirmDelete() {
  const product = toDelete.value
  toDelete.value = null
  if (product) await remove(product)
}

// El acceso directo del panel llega con ?nuevo=1.
onMounted(() => {
  if (route.query.nuevo) openEditor(null)
})
</script>

<template>
  <AdminShell>
    <AdminPageHeader :eyebrow="copy.eyebrow" :title="copy.title" :lead="loading ? '' : copy.count(total)">
      <button type="button" class="btn btn--dark btn--dot products__new" @click="openEditor(null)">
        <i class="fa-solid fa-plus" aria-hidden="true"></i> {{ copy.newProduct }}
      </button>
    </AdminPageHeader>

    <ProductToolbar :filters="filters" :has-filters="hasFilters" @clear="clearFilters" />

    <div class="products__state" :aria-busy="loading">
      <ul v-if="loading && !items.length" class="products__skeleton" aria-hidden="true">
        <li v-for="n in 5" :key="n"></li>
      </ul>
      <AdminEmpty v-else-if="error" tone="error" icon="fa-solid fa-plug-circle-xmark" :message="`${copy.loadError}: ${error}`">
        <button type="button" class="btn btn--dark" @click="load">{{ adminCopy.dashboard.retry }}</button>
      </AdminEmpty>
      <AdminEmpty
        v-else-if="!items.length"
        icon="fa-solid fa-box-open"
        :message="hasFilters ? copy.empty : copy.emptyAll"
      >
        <button v-if="hasFilters" type="button" class="btn btn--ghost" @click="clearFilters">{{ copy.clear }}</button>
        <button v-else type="button" class="btn btn--dark btn--dot" @click="openEditor(null)">{{ copy.newProduct }}</button>
      </AdminEmpty>
      <ProductList
        v-else
        :class="{ 'products__list--loading': loading }"
        :products="items"
        :busy="busy"
        @toggle="toggle"
        @edit="openEditor"
        @remove="(p) => (toDelete = p)"
      />
    </div>

    <AdminPager :page="page" :pages="pages" @go="goTo" />

    <ProductEditor :open="editorOpen" :product="editing" @close="closeEditor" @saved="upsert" />

    <BaseModal
      :open="Boolean(toDelete)"
      danger
      :title="copy.deleteTitle"
      :message="toDelete ? copy.deleteMessage(toDelete.name) : ''"
      :confirm-label="copy.deleteConfirm"
      @confirm="confirmDelete"
      @cancel="toDelete = null"
    />
  </AdminShell>
</template>

<style scoped lang="scss">
.products {
  &__new {
    min-height: 46px;
    font-size: 1.05rem;
  }

  &__list--loading {
    opacity: 0.55;
    transition: opacity 0.2s ease;
  }

  &__skeleton {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.6rem);

    li {
      height: 92px;
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
