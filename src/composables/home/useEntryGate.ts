import { prefersReducedMotion } from './useMotion'

const KEY = 'animall_gate_seen'

// Si sessionStorage no está disponible, al menos no se repite en esta carga.
let shownThisLoad = false

function seenInSession(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function markGateSeen() {
  shownThisLoad = true
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    // Sin almacenamiento basta con la marca en memoria.
  }
}

/**
 * La pelota solo aparece cuando alguien ENTRA al sitio por el home: una vez
 * por sesión, nunca al volver al home navegando dentro de la tienda (vue-router
 * deja `history.state.back` en null solo en la primera entrada) y nunca para
 * quien pidió menos movimiento.
 */
export function shouldShowGate(): boolean {
  if (typeof window === 'undefined') return false
  if (shownThisLoad || prefersReducedMotion() || seenInSession()) return false
  const state = window.history.state as { back?: string | null } | null
  return !state?.back
}
