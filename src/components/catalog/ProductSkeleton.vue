<template>
  <div class="skeleton" aria-hidden="true">
    <span class="skeleton__art"></span>
    <span class="skeleton__line skeleton__line--short"></span>
    <span class="skeleton__line"></span>
    <span class="skeleton__line skeleton__line--price"></span>
    <span class="skeleton__btn"></span>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  position: relative;
  @include flex(column, stretch, flex-start, 0.6rem);
  background: $surface;
  border-radius: $radius-lg;
  padding: 0.5rem 0.5rem 0.9rem;
  overflow: hidden;

  // Brillo que cruza: solo transform, nada de animar background-position.
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, transparent 30%, rgba($surface, 0.7) 50%, transparent 70%);
    transform: translateX(-100%);
    animation: shine 1.4s ease-in-out infinite;
  }

  &__art {
    aspect-ratio: 1;
    border-radius: $radius-md;
    background: $mint;
    margin-bottom: 0.4rem;
  }

  &__line,
  &__btn {
    height: 12px;
    margin-inline: 0.35rem;
    border-radius: $radius-pill;
    background: $sand;

    &--short {
      width: 40%;
      height: 9px;
    }

    &--price {
      width: 55%;
      height: 26px;
    }
  }

  &__btn {
    height: 44px;
    margin-top: 0.3rem;
    margin-inline: 0;
  }
}

@keyframes shine {
  to {
    transform: translateX(100%);
  }
}
</style>
