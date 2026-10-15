import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

/** Nombre visible del usuario y cierre de sesión, compartidos por el marco del admin. */
export function useAdminSession() {
  const userStore = useUserStore()
  const router = useRouter()

  const displayName = computed(() => {
    const user = userStore.user
    if (!user) return ''
    return user.name?.trim() || user.email.split('@')[0] || user.email
  })

  const firstName = computed(() => displayName.value.split(' ')[0] ?? '')

  const initials = computed(() =>
    displayName.value
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join(''),
  )

  function logout() {
    userStore.clear()
    router.replace('/login')
  }

  return { user: computed(() => userStore.user), displayName, firstName, initials, logout }
}
