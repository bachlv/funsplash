<template>
  <div>
    <div :style="gridGapStyle" class="result-container">
      <ImageCard
        v-for="image in searchResult?.results"
        :image="image"
        :grid-gap="gridGap"
      />
    </div>
    <div class="loading">
      <p v-if="isEndOfResult">No more results</p>
      <p v-else>Loading...</p>
      <IntersectionObserver @intersect="intersected" />
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

onMounted(() => {
  useState('loading').value = false;
});

watch(loading, (value: boolean) => {
  useState('loading').value = value;
});
</script>

<style lang="scss">
.result-container {
  display: grid;
  grid-gap: var(--grid-gap);
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-auto-flow: dense;
  grid-auto-columns: 1px;
  max-width: var(--screen-xl);
  margin: 5rem auto;
}

.loading {
  text-align: center;
  padding: 0 0 2rem;
}
</style>
