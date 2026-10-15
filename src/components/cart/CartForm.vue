<script setup lang="ts">
import { contacts, site } from '@/config/site'
import { useCheckout } from '@/composables/cart/useCheckout'
import { cartCopy } from '@/config/site'

const { form, errors } = useCheckout()
</script>

<template>
  <div class="form">
    <div class="form__field">
      <label for="co-name">{{ site.cart.nameLabel }}</label>
      <input
        id="co-name"
        v-model="form.name"
        type="text"
        autocomplete="name"
        maxlength="80"
        :placeholder="cartCopy.namePlaceholder"
        :aria-invalid="Boolean(errors.name)"
        :aria-describedby="errors.name ? 'co-name-err' : undefined"
        @input="errors.name = ''"
      />
      <p v-if="errors.name" id="co-name-err" class="form__error">{{ errors.name }}</p>
    </div>

    <div class="form__field">
      <label for="co-phone">{{ site.cart.phoneLabel }}</label>
      <input
        id="co-phone"
        v-model="form.phone"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        maxlength="20"
        :placeholder="cartCopy.phonePlaceholder"
        :aria-invalid="Boolean(errors.phone)"
        :aria-describedby="errors.phone ? 'co-phone-err' : undefined"
        @input="errors.phone = ''"
      />
      <p v-if="errors.phone" id="co-phone-err" class="form__error">{{ errors.phone }}</p>
    </div>

    <div class="form__field">
      <label for="co-note">{{ site.cart.noteLabel }}</label>
      <textarea id="co-note" v-model="form.note" rows="2" maxlength="500" :placeholder="site.cart.notePlaceholder"></textarea>
    </div>

    <fieldset class="form__stores">
      <legend>{{ site.cart.storeLabel }}</legend>
      <label
        v-for="contact in contacts"
        :key="contact.key"
        class="store"
        :class="{ 'store--on': form.store === contact.key }"
      >
        <input v-model="form.store" class="visually-hidden" type="radio" name="co-store" :value="contact.key" />
        <span class="store__icon" aria-hidden="true"><i class="fa-brands fa-whatsapp"></i></span>
        <span class="store__text">
          <span class="store__label">{{ contact.label }}</span>
          <strong class="store__name">{{ contact.name }}</strong>
          <span class="store__phone">{{ contact.phone }}</span>
        </span>
        <span class="store__check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
      </label>
      <p v-if="errors.store" class="form__error">{{ errors.store }}</p>
    </fieldset>
  </div>
</template>

<style scoped lang="scss">
.form {
  @include flex(column, stretch, flex-start, 1rem);

  &__field {
    input,
    textarea {
      min-height: 50px;
      border-radius: $radius-md;
      border: 1.5px solid $line;
      font-size: 1rem;

      &:focus {
        border-color: $ink;
        box-shadow: 0 0 0 3px rgba($accent-deep, 0.25);
      }

      &[aria-invalid='true'] {
        border-color: $danger;
      }
    }

    textarea {
      resize: vertical;
    }

    label {
      font-weight: 700;
      color: $ink;
    }
  }

  &__error {
    margin-top: 0.35rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: $danger;
  }

  &__stores {
    border: 0;
    @include flex(column, stretch, flex-start, 0.5rem);

    legend {
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
  }
}

.store {
  @include flex(row, center, flex-start, 0.8rem);
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: $radius-md;
  border: 1.5px solid $line;
  background: $surface;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: $ink;
  }

  &:has(input:focus-visible) {
    outline: 3px solid $accent-deep;
    outline-offset: 2px;
  }

  &--on {
    border-color: $ink;
    background: $mint;
    box-shadow: inset 0 0 0 1px $ink;
  }

  &__icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $ink;
    color: $accent;
    font-size: 1.3rem;
    @include flex(row, center, center);
  }

  &__text {
    flex: 1;
    @include flex(column, flex-start, flex-start);
    line-height: 1.25;
  }

  &__label {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: $accent-deep;
  }

  &__name {
    font-size: 0.95rem;
    color: $ink;
  }

  &__phone {
    font-size: 0.8rem;
    color: $ink-soft;
  }

  &__check {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1.5px solid $line;
    @include flex(row, center, center);
    font-size: 0.65rem;
    color: transparent;

    .store--on & {
      background: $ink;
      border-color: $ink;
      color: $accent;
    }
  }
}
</style>
