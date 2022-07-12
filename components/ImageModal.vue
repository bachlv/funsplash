<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div v-if="show" class="modal-mask-bg" @click="$emit('close')"></div>
      <div class="modal-wrapper">
        <div class="modal-container">
          <img
            :src="image.src.regular"
            class="modal-img"
            :alt="image.description"
          />

          <div class="modal-info">
            <NuxtLink :to="'/photos/' + image.id" class="img-info-author">{{
              image.photographer
            }}</NuxtLink>
            <NuxtLink :to="'/photos/' + image.id" class="img-info-desc">{{
              image.description
            }}</NuxtLink>
            <a
              class="btn-download primary"
              :href="image.link"
              target="_blank"
              tabindex="0"
              ><IconDownload
            /></a>
          </div>
          <button class="modal-close-button" @click="$emit('close')">
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { FunsplashImage } from 'types';

export default {
  props: {
    image: {
      type: Object as PropType<FunsplashImage>,
      required: true,
    },
    show: Boolean,
  },

  methods: {
    handleKeyboardEvents(event: KeyboardEvent) {
      if (event.code === 'Escape') this.$emit('close');
    },
  },

  unmounted() {
    document.removeEventListener('keydown', this.handleKeyboardEvents);
  },

  watch: {
    show(value: boolean) {
      if (value)
        document.addEventListener('keydown', this.handleKeyboardEvents);
      else document.removeEventListener('keydown', this.handleKeyboardEvents);
    },
  },
};
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  transition: opacity 0.1s ease-out;
}

.modal-mask-bg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
}

.modal-container {
  position: relative;
  display: flex;
  align-content: center;
  flex-direction: column;
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.2s ease-out;
}

.modal-img {
  max-width: 80vw;
  max-height: 80vh;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
}

.modal-info {
  display: flex;
  flex-direction: column;
  margin: 1.5rem;
  position: relative;
  min-height: 2.5rem;
}

.img-info-author {
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.img-info-desc {
  margin: 0;
  margin-right: 3.5rem;
}

.modal-close-button {
  position: absolute;
  top: -10px;
  right: -48px;
  width: 2.5rem;
  height: 2.5rem;
  background: none;
  border: none;
  cursor: pointer;
  svg {
    color: white;
  }
  opacity: 0.8;
  transition: opacity 0.1s ease-out;
  &:hover,
  &:focus {
    opacity: 1;
  }
}

.btn-download {
  &.primary {
    position: absolute;
    top: 0;
    right: 0;
    height: 2.75rem;
    width: 2.75rem;
    svg {
      padding: 0.125rem;
      color: black;
    }
  }
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(0.9);
  transform: scale(0.9);
}
</style>
