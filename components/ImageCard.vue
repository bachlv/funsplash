<template>
  <div
    :style="{
      'grid-row-end': `span ${Math.ceil(
        (image.height / image.width) * (offsetWidth / gridGap)
      )}`,
      position: 'relative',
    }"
    @click="(e) => onClick(e)"
    class="img-card"
  >
    <div class="img-overlay">
      <a class="img-desc">
        {{ image.description }}
      </a>

      <div class="card-bottom">
        <a class="vendor-info" :href="image.link" target="_blank">
          <img
            :src="`/images/${image.provider}.png`"
            class="vendor-logo"
            :class="{ 'vendor-logo-alt': image.provider === 'pixabay' }"
          />
          <div>{{ image.photographer }}</div>
        </a>
        <a class="btn-download" :href="image.link" target="_blank"
          ><IconDownload
        /></a>
      </div>
    </div>

    <img :src="image.src.regular" @load="loadImage" class="img-result" />
    <div v-if="!isLoaded" class="img-loading"></div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { SearchResultImage } from '~~/types';

export default {
  props: {
    image: {
      type: Object as PropType<SearchResultImage>,
      required: true,
    },
    gridGap: Number,
  },
  data() {
    return {
      offsetWidth: 350,
      isLoaded: false,
    };
  },
  methods: {
    loadImage() {
      this.isLoaded = true;
    },

    onClick(e) {
      console.log(e);
      // window.history.pushState({}, null, '/photos/' + this.image.id);
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
}

.img-result {
  height: 100%;
  width: 100%;
  object-fit: cover;
  background-color: #0000000f;
}

.img-overlay {
  display: flex;
  flex-direction: column-reverse;
  margin: 1rem 1rem 5rem;
  @include tablet() {
    position: absolute;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    margin: unset;
    text-shadow: 0 0 0.25rem black;
    opacity: 0;
    transition: opacity 0.2s ease-out;
    &.focused,
    &:hover {
      opacity: 1;
      background: linear-gradient(
        180deg,
        #00000055,
        #00000000 20%,
        #00000000 80%,
        #00000055
      );
    }
  }
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  // align-items: center;
}

.img-desc {
  font-size: 0.75rem;
  padding-right: 2.5rem;
  @include transition-opacity;
  @include tablet() {
    font-size: 0.875rem;
    color: white;
  }
}

.btn-download {
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
    height: 2.5rem;
    padding: 0.5rem;
    right: unset;
    svg {
      color: gray;
    }
  }
}

.vendor-info {
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
  margin-left: 0.25rem;
  margin-bottom: 0.2rem;
  filter: invert(100%);

  @include tablet() {
    max-height: 1rem;
    margin-bottom: 0.125rem;
    margin-right: 0.5rem;
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
