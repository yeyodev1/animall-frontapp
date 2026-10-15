import { reactive, ref } from 'vue'
import { orderService } from '@/services/order.service'
import { useCartStore } from '@/stores/cart'
import { contacts, type ContactKey } from '@/config/site'
import type { ApiError, Order } from '@/types'
import { cartCopy } from '@/config/site'

export type CheckoutStep = 'cart' | 'form' | 'success'

// Estado de módulo: la ficha de producto abre el carrito directo en el formulario.
const step = ref<CheckoutStep>('cart')
const form = reactive({ name: '', phone: '', note: '', store: contacts[0].key as ContactKey })
const errors = reactive<{ name: string; phone: string; store: string; general: string }>({
  name: '',
  phone: '',
  store: '',
  general: '',
})
const sending = ref(false)
const order = ref<Order | null>(null)
const whatsappUrl = ref('')
const popupBlocked = ref(false)

function isMobile(): boolean {
  return window.matchMedia('(max-width: 767px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function useCheckout() {
  const cart = useCartStore()

  function validate(): boolean {
    errors.name = form.name.trim().length >= 2 ? '' : cartCopy.nameError
    const digits = form.phone.replace(/\D/g, '')
    errors.phone = digits.length >= 7 && digits.length <= 15 ? '' : cartCopy.phoneError
    errors.store = contacts.some((c) => c.key === form.store) ? '' : cartCopy.storeError
    errors.general = ''
    return !errors.name && !errors.phone && !errors.store
  }

  function openWhatsapp() {
    if (!whatsappUrl.value) return
    // En el celular WhatsApp abre la app; en escritorio una pestaña nueva para no perder la web.
    if (isMobile()) {
      window.location.href = whatsappUrl.value
      return
    }
    const win = window.open(whatsappUrl.value, '_blank')
    if (win) {
      win.opener = null
      popupBlocked.value = false
    } else {
      popupBlocked.value = true
    }
  }

  async function submit() {
    if (sending.value || !validate()) return
    sending.value = true
    try {
      const data = await orderService.create({
        customer: { name: form.name.trim(), phone: form.phone.trim(), note: form.note.trim() },
        store: form.store,
        items: cart.items.map((i) => ({ slug: i.slug, size: i.size, qty: i.qty })),
      })
      order.value = data.order
      whatsappUrl.value = data.whatsappUrl
      cart.clear()
      step.value = 'success'
      openWhatsapp()
    } catch (e) {
      errors.general = (e as ApiError).message || 'No pudimos enviar el pedido'
    } finally {
      sending.value = false
    }
  }

  function goTo(next: CheckoutStep) {
    errors.general = ''
    step.value = next
  }

  /** Al cerrar tras un pedido enviado, la próxima apertura vuelve al carrito. */
  function resetIfDone() {
    if (step.value === 'success') {
      step.value = 'cart'
      order.value = null
      whatsappUrl.value = ''
      popupBlocked.value = false
      form.note = ''
    }
  }

  return { step, form, errors, sending, order, whatsappUrl, popupBlocked, submit, openWhatsapp, goTo, resetIfDone }
}
