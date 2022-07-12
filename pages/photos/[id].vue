<template>
  <div class="img-container">
    <Title>{{ formatTitle(image.description) }}</Title>

    <img @load="onLoad" :src="image.src.regular" :alt="image.description" />

    <div v-show="isLoaded" class="img-info">
      <p class="img-info-author">{{ image.photographer }}</p>
      <p class="img-info-desc">{{ image.description }}</p>
      <a class="btn-download" href="javascript:;" target="_blank" tabindex="1"
        >Download <IconDownload
      /></a>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  setup: async function () {
    const { data, error } = await useFetch(
      '/api/photos/' + useRoute().params.id
    );
    const image = ref(data);
    const isLoaded = ref(false);

    return {
      image,
      isLoaded,
    };
  },

  methods: {
    onLoad() {
      useState('loading').value = false;
      this.isLoaded = true;
    },
    formatTitle(s: string) {
      return (
        s.charAt(0).toUpperCase() +
        s.slice(1).replace(/ ./g, (c) => c.toUpperCase())
      );
    },
  },

  created() {
    if (!this.image) navigateTo('/404');
  },

  mounted() {
    useState('page').value = 'photos';
  },
};
</script>

<style lang="scss" scoped>
.img-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 5rem auto 0 auto;
  max-width: 1024px;
  img {
    max-width: 100%;
    align-self: center;
  }
}

.img-info {
  position: relative;
  margin: 3rem 2rem;
  width: inherit;

  .img-info-desc {
    margin-right: 8.5rem;
  }

  .btn-download {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    height: 2.5rem;
    width: 7.5rem;
    background-color: var(--color-primary);
    opacity: 1;
    color: white;
    font-weight: 600;
    &:focus {
      outline: var(--border-width) solid var(--color-primary);
      outline-offset: 0.125rem;
    }
    svg {
      padding-left: 0.25rem;
      height: 1.25rem;
      color: white;
    }
  }
}
</style>
