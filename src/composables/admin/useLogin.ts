import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { adminCopy } from '@/components/admin/adminCopy'
import type { ApiError } from '@/types'

export function useLogin() {
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const toast = useToastStore()

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)
  const loading = ref(false)
  const error = ref('')

  /** Solo rutas internas: un `next` externo sería una redirección abierta. */
  function nextPath(): string {
    const next = route.query.next
    if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) return next
    return '/admin'
  }

  async function submit() {
    if (loading.value) return
    error.value = ''
    loading.value = true
    try {
      const user = await userStore.login(email.value.trim(), password.value)
      toast.success(adminCopy.login.welcome(user.name || user.email))
      router.replace(user.accountType === 'admin' ? nextPath() : '/')
    } catch (e) {
      error.value = (e as ApiError).message
    } finally {
      loading.value = false
    }
  }

  return { email, password, showPassword, loading, error, submit }
}
