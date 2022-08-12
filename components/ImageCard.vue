<template>
  <div
    :style="{
      'grid-row-end': `span ${Math.floor(
        (image.height / image.width) * gridGap
      )}`,
      position: 'relative',
      // 'aspect-ratio': `${image.width / image.height}`,
    }"
    class="img-card"
    @mouseenter="onFocus(true)"
    @mouseleave="onFocus(false)"
    @focus="onFocus(true)"
    @blur="onFocus(false)"
    tabindex="0"
    @keydown.enter="showModalOnEvent"
  >
    <div class="img-overlay" :class="{ focused: isFocused }">
      <NuxtLink class="img-desc" :to="'/photos/' + image.id" tabindex="-1">
        {{ image.description }}
      </NuxtLink>

      <div class="card-bottom">
        <a class="vendor-info" :href="image.link" target="_blank" tabindex="-1">
          <img
            class="vendor-logo"
            :src="`/images/${image.provider}.png`"
            :class="{ 'vendor-logo-alt': image.provider === 'pixabay' }"
            :alt="`${image.provider} logo`"
          />
          <div>{{ image.photographer }}</div>
        </a>
        <a class="btn-download" :href="image.link" target="_blank" tabindex="-1"
          ><IconDownload
        /></a>
      </div>
    </div>

    <img
      ref="img"
      class="img-result"
      :src="image.src.regular"
      @click="showModalOnEvent"
      :alt="image.description"
      :style="`aspect-ratio: ${image.width / image.height};`"
    />

    <Teleport v-if="isFocused || showModal" :disabled="isFocused" to="body">
      <ImageModal
        :image="image"
        :show="showModal"
        @close="closeModal"
        @keydown.esc="showModal = false"
      >
        <template #header>
          <h3>custom header</h3>
        </template>
      </ImageModal>
    </Teleport>
  </div>
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
    gridGap: Number,
  },

  data() {
    return {
      isLoaded: false,
      showModal: false,
      isFocused: false,
      isMounted: false,
    };
  },

  mounted() {
    this.isMounted = true;
  },

  methods: {
    onFocus(value: boolean) {
      this.isFocused = value;
    },

    showModalOnEvent() {
      if (window.innerWidth > 640) {
        this.showModal = true;
        window.history.pushState({}, null, '/photos/' + this.image.id);
        this.$el.blur();
      } else navigateTo('/photos/' + this.image.id);
    },
    closeModal(skipRouter: boolean) {
      this.showModal = false;
      this.isFocused = true;
      if (!skipRouter) this.$router.back();
    },
  },
};
</script>

<style lang="scss">
@mixin tablet {
  @media (min-width: 640px) {
    @content;
  }
}

@mixin transition-opacity {
  opacity: 0.8;
  transition: opacity 0.1s ease-out;
  &:hover,
  &:focus {
    opacity: 1;
  }
}

.img-card {
  display: flex;
  flex-direction: column-reverse;
  transition: box-shadow 0.3s ease-out;

  @include tablet {
    border-radius: var(--border-radius);
    background: var(--color-accent);
    &:focus {
      outline: var(--border-width) solid var(--color-primary);
      outline-offset: 0.125rem;
    }
    &:hover,
    &:focus {
      box-shadow: var(--shadow-xl);
    }
  }
}

.img-result {
  height: 100%;
  width: 100%;
  object-fit: cover;

  cursor: pointer;
  @include tablet() {
    cursor: zoom-in;
    border-radius: var(--border-radius);
  }
}

.img-overlay {
  display: flex;
  flex-direction: column-reverse;
  margin: 1rem 1rem 5rem;
  border-radius: var(--border-radius);

  @include tablet() {
    position: absolute;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    margin: unset;
    text-shadow: 0 0 0.25rem black;
    transition: opacity 0.2s ease-out;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      #00000055,
      #00000000 20%,
      #00000000 80%,
      #00000055
    );
  }
  &.focused {
    opacity: 1;
  }
}

.card-bottom {
  display: flex;
  justify-content: space-between;
}

.img-desc {
  font-size: 0.75rem;
  padding-right: 3.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  pointer-events: all;
  @include transition-opacity;
  @include tablet() {
    overflow: visible;
    white-space: unset;

    font-size: 0.875rem;
    color: white;
  }
}

.btn-download {
  pointer-events: all;
  position: absolute;
  right: 1rem;
  width: 3rem;
  height: 2.125rem;
  display: flex;
  justify-content: center;
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-accent);
  background-color: white;
  padding: 0.375rem;
  @include transition-opacity;
  svg {
    color: black;
  }

  @include tablet() {
    position: relative;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0.5rem;
    right: unset;
    svg {
      color: gray;
    }
  }
}

.vendor-info {
  pointer-events: all;
  display: flex;
  align-items: flex-end;
  max-width: fit-content;
  flex-direction: row-reverse;

  transition: opacity 0.1s ease-out;
  @include tablet {
    @include transition-opacity;
    color: white;
    flex-direction: unset;
  }
}

.vendor-logo {
  max-height: 0.875rem;
  margin: 0 0 0.2rem 0.25rem;
  filter: invert(100%);

  @include tablet() {
    max-height: 1rem;
    margin: 0 0.5rem 0.125rem 0;
    filter: drop-shadow(0 0 0.125rem #000000dd);
  }
}
.vendor-logo-alt {
  margin-bottom: 0.125rem;
  @include tablet() {
    margin-bottom: 0;
  }
}
</style>
