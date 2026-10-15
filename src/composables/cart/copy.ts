/**
 * Textos del carrito que todavía no están en `site.cart`.
 * TODO copy: mover a `site.cart` y borrar este archivo.
 */
export const cartCopy = {
  close: 'Cerrar carrito',
  back: 'Volver al carrito',
  stepCart: 'Carrito',
  stepForm: 'Tus datos',
  remove: (name: string) => `Quitar ${name} del carrito`,
  decrease: (name: string) => `Quitar uno de ${name}`,
  increase: (name: string) => `Agregar uno de ${name}`,
  qtyOf: (name: string) => `Cantidad de ${name}`,
  items: (n: number) => (n === 1 ? '1 producto' : `${n} productos`),
  namePlaceholder: 'Cómo te llamas',
  phonePlaceholder: '09X XXX XXXX',
  nameError: 'Escribe tu nombre',
  phoneError: 'Escribe un teléfono válido',
  storeError: 'Elige a quién le escribes',
  sending: 'Enviando…',
  successTitle: 'Pedido listo',
  codeLabel: 'Código de tu pedido',
  openWhatsapp: 'Abrir WhatsApp',
  blocked: 'Tu navegador bloqueó la ventana. Toca el botón para abrir WhatsApp.',
  keepShopping: 'Seguir comprando',
  promo: 'Promo',
} as const
