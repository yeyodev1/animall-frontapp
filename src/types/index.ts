/** Forma con la que httpBase rechaza cualquier error del API. */
export interface ApiError {
  status: number
  message: string
  data?: unknown
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

/** Lo que devuelve el backapp en /auth/login y /auth/me. */
export interface SessionUser {
  id: string
  email: string
  name: string
  phone: string
  accountType: 'customer' | 'admin' | string
}

export type Species = 'perro' | 'gato' | 'ave' | 'pez' | 'roedor' | 'granja' | 'general'
export type ProductType =
  | 'alimento-seco'
  | 'alimento-humedo'
  | 'snack'
  | 'farmacia'
  | 'higiene'
  | 'accesorio'
  | 'otro'
export type CatalogKey = 'general' | 'super-premium'

/** Precios en centavos: PVP es el de referencia (tachado) y PVC el precio Animall. */
export interface Variant {
  size: string
  pvp: number
  pvc: number
  promo: string | null
}

export interface Product {
  _id: string
  slug: string
  name: string
  brand: string
  manufacturer: string
  category: string
  categorySlug: string
  species: Species
  type: ProductType
  catalogs: CatalogKey[]
  variants: Variant[]
  image: { url: string; publicId: string }
  isPublished: boolean
  isFeatured: boolean
  sortIndex: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductQuery {
  search?: string
  species?: string
  type?: string
  category?: string
  brand?: string
  catalog?: string
  promo?: string
  sort?: string
  page?: number
  limit?: number
}

export interface FilterOption {
  value: string
  label: string
  count: number
}

export interface ProductFilters {
  species: FilterOption[]
  types: FilterOption[]
  brands: FilterOption[]
  categories: FilterOption[]
  total: number
}

export interface CartItem {
  slug: string
  name: string
  image: string
  size: string
  pvp: number
  pvc: number
  promo: string | null
  qty: number
}

export type OrderStatus = 'nueva' | 'confirmada' | 'entregada' | 'cancelada'

export interface OrderItem {
  slug: string
  name: string
  size: string
  qty: number
  pvp: number
  pvc: number
  promo: string | null
  image: string
}

export interface Order {
  _id: string
  code: string
  customer: { name: string; phone: string; note: string }
  store: string
  items: OrderItem[]
  subtotalPvp: number
  total: number
  status: OrderStatus
  createdAt: string
}

export interface CreateOrderInput {
  customer: { name: string; phone: string; note: string }
  store: string
  items: { slug: string; size: string; qty: number }[]
}

export interface AdminStats {
  orders: Partial<Record<OrderStatus, number>>
  revenue: number
  ordersCount: number
  products: number
  unpublished: number
}
