import { adminCopy } from './adminCopy'

/** Secciones del panel; `exact` evita que "/admin" quede activo en todas. */
export const adminLinks = [
  { to: '/admin', label: adminCopy.nav.dashboard, icon: 'fa-solid fa-house', exact: true, badge: false },
  { to: '/admin/productos', label: adminCopy.nav.products, icon: 'fa-solid fa-box-open', exact: false, badge: false },
  { to: '/admin/pedidos', label: adminCopy.nav.orders, icon: 'fa-solid fa-receipt', exact: false, badge: true },
] as const
