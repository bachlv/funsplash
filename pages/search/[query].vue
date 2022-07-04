<template>
  <div>
    <div class="header">
      <NuxtLink to="/">Back</NuxtLink>
    </div>

    <div class="result-container">
      <img
        v-for="image in searchResult.results"
        :src="image.src.regular"
        class="result-img"
      />
      <!-- style="{
            'aspect-ratio': {image.width / image.height};
          }" -->
    </div>
    <div class="loading">
      <p>Loading... {{ searchParams }}</p>
      <IntersectionObserver @intersect="intersected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchParams, SearchResult } from '~/types';

const pagination = ref(1);
const searchParams = ref({
  query: useRoute().params.query as string,
  page: pagination,
});
const loading = ref(false);
useState('page').value = 'search';

const getCurrentPage = () => {
  const pageNumber = parseInt(useRoute().query.page as string);
  pagination.value = isFinite(pageNumber) ? pageNumber : 1;
};
getCurrentPage();

const getImages = async (query: SearchParams | Record<string, number>) => {
  const { data: result } = await useFetch<SearchResult>('/api/search', {
    params: query,
  });
  return result;
};
const searchResult = ref(await getImages(searchParams.value));

const intersected = async () => {
  if (loading.value) return;
  loading.value = true;
  pagination.value = searchParams.value.page + 1;
  return await getImages(searchParams.value)
    .then((nextSearchResult) => {
      searchResult.value.results.push(...nextSearchResult.value.results);
      loading.value = false;
    })
    .catch(() => (pagination.value = searchParams.value.page) - 1);
};
</script>

<style lang="scss">
.header {
  text-align: center;
  padding: 32px;
}

.result-container {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.result-img {
  background-color: #eee;
  display: inline-block;
  margin: 0 0 0.125em;
  width: 100%;
}
.loading {
  text-align: center;
  margin: 2rem;
}
</style>
