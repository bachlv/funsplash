<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div v-if="show" class="modal-mask-bg" @click="$emit('close')"></div>
      <div class="modal-wrapper">
        <div class="modal-container">
          <img
            ref="img"
            :src="image.src.regular"
            class="modal-img"
            :alt="image.description"
          />

          <div class="modal-info">
            <div>
              <NuxtLink :to="'/photos/' + image.id" class="img-info-author">{{
                image.photographer
              }}</NuxtLink>
            </div>
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
    $route() {
      this.$emit('close', true);
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
  background-color: #000;
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
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0.75rem 1.5rem;
  min-height: 2.25rem;
  justify-content: center;
}

.img-info-author {
  font-weight: 600;
  width: 100%;
}
.modal-container .img-info-author {
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  &:hover,
  &:focus {
    opacity: 1;
  }
}

.img-info-desc {
  margin: 0;
  margin-right: 3.5rem;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
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
    border: none;
    background-color: #000;
    svg {
      padding: 0.125rem;
      color: white;
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
