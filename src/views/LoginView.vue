<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LoginHero from '@/components/admin/login/LoginHero.vue'
import { adminCopy } from '@/components/admin/adminCopy'
import { useLogin } from '@/composables/admin/useLogin'

const copy = adminCopy.login
const { email, password, showPassword, loading, error, submit } = useLogin()
</script>

<template>
  <div class="login">
    <LoginHero />

    <section class="login__panel">
      <form class="login__form" novalidate @submit.prevent="submit">
        <h2 class="login__title">{{ copy.title }}</h2>

        <div class="login__field">
          <label for="login-email">{{ copy.email }}</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            inputmode="email"
            autocomplete="username"
            :placeholder="copy.emailPlaceholder"
            required
            :aria-invalid="Boolean(error)"
            aria-describedby="login-error"
          />
        </div>

        <div class="login__field">
          <label for="login-password">{{ copy.password }}</label>
          <div class="login__password">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              :aria-invalid="Boolean(error)"
              aria-describedby="login-error"
            />
            <button
              type="button"
              class="login__eye"
              :aria-label="showPassword ? copy.hidePassword : copy.showPassword"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <p id="login-error" class="login__error" role="alert" aria-live="assertive">
          <template v-if="error">
            <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
            {{ error }}
          </template>
        </p>

        <button
          class="btn btn--dark btn--dot login__submit"
          type="submit"
          :disabled="loading || !email || !password"
          :aria-busy="loading"
        >
          <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          {{ loading ? copy.loading : copy.submit }}
        </button>

        <RouterLink to="/" class="login__back">
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
          {{ copy.back }}
        </RouterLink>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login {
  @include flex(column, stretch, flex-start);
  min-height: 100vh;
  min-height: 100dvh;
  background: $paper;

  @include from('lg') {
    flex-direction: row;
  }

  &__panel {
    flex: 1;
    @include flex(column, center, center);
    padding: 2rem 1.25rem 3rem;

    @include from('lg') {
      flex: 1 1 45%;
      padding: 3rem;
    }
  }

  &__form {
    width: 100%;
    max-width: 400px;
    @include flex(column, stretch, flex-start, 1.1rem);
  }

  &__title {
    @include display($display-sm, $ink);
    margin-bottom: 0.4rem;
  }

  &__field input {
    min-height: 50px;
    font-size: 1rem;
  }

  &__password {
    position: relative;

    input {
      padding-right: 3.2rem;
    }
  }

  &__eye {
    position: absolute;
    top: 50%;
    right: 0.35rem;
    transform: translateY(-50%);
    width: 42px;
    height: 42px;
    border-radius: $radius-sm;
    color: $ink-soft;
    @include flex(row, center, center);
    @include transition(background);

    &:hover {
      background: $sand;
    }
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: #ae2a1d;
    border-radius: $radius-sm;

    &:not(:empty) {
      background: $danger-bg;
      padding: 0.7rem 0.9rem;
    }
  }

  &__submit {
    width: 100%;
    min-height: 54px;
  }

  &__back {
    align-self: center;
    @include flex(row, center, center, 0.45rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    padding: 0.6rem 0.8rem;
    border-radius: $radius-sm;

    &:hover {
      color: $accent-deep;
    }
  }
}
</style>
