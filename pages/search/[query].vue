<template>
  <div>
    <div :style="gridGapStyle" class="result-container">
      <ImageCard
        v-for="image in searchResult?.results"
        :image="image"
        :grid-gap="gridGap"
      />
    </div>

    <div class="result-loading">
      <div v-if="isEndOfResult">This is the end...</div>
      <div v-else>Loading...</div>
      <IntersectionObserver
        @intersect="intersected"
        :options="{ rootMargin: '1600px' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchParams, SearchResult } from '~/types';

const getCurrentPagination = () => {
  const pageNumber = parseInt(useRoute().query.page as string);
  return isFinite(pageNumber) ? pageNumber : 1;
};

const pagination = ref(getCurrentPagination());
const searchParams = ref({
  query: useRoute().params.query as string,
  page: pagination,
});
const loading = ref(false);
useState('page').value = 'search';

const getImages = async (query: SearchParams | Record<string, number>) => {
  const { data: result } = await useFetch<SearchResult>('/api/search', {
    params: query,
  });
  return result;
};
const searchResult = ref(await getImages(searchParams.value));
const isEndOfResult = ref(false);

const intersected = async () => {
  if (loading.value) return;
  loading.value = true;
  pagination.value = searchParams.value.page + 1;

  return await getImages(searchParams.value)
    .then((nextSearchResult) => {
      const nextResultLength = nextSearchResult.value.results.length;

      if (nextResultLength) {
        searchResult.value.results.push(...nextSearchResult.value.results);
      } else isEndOfResult.value = true;

      loading.value = false;
    })
    .catch(() => (pagination.value = searchParams.value.page) - 1);
};

const gridGap = ref(16);
const gridGapStyle = computed(() => ({
  '--grid-gap': '16px',
}));

const formatTitle = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/ ./g, (c) => c.toUpperCase());

onMounted(() => {
  useState('loading').value = false;
  window.scrollTo(0, 0);
});

onUnmounted(() => {
  searchResult.value = null;
});

watch(loading, (value: boolean) => {
  useState('loading').value = value;
});

useHead({
  title: `Free ${formatTitle(searchParams.value.query)} images`,
});
</script>

<style lang="scss">
.result-container {
  margin: 5rem auto 0 auto;
  @media (min-width: 640px) {
    display: grid;
    grid-gap: var(--grid-gap);
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-auto-flow: dense;
    grid-auto-columns: 1px;
    max-width: var(--screen-xl);
    margin: 5rem auto;
  }
  @media (min-width: 640px) and (max-width: 1280px) {
    margin: 5rem 1rem;
  }
}

.result-loading {
  text-align: center;
  @media (min-width: 640px) {
    color: gray;
  }
  margin: 0 0 6rem;
}
</style>
