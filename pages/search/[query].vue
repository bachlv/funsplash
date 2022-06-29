<template>
  <div>
    <div class="header">
      <h1>{{ searchResult.total }} results</h1>
    </div>

    <div class="result-container" v-for="image in searchResult.results">
      <img
        :src="image.src.regular"
        class="result-img"
        style="{
            'aspect-ratio': {image.width / image.height};
          }"
      />
    </div>
    <div class="loading">
      <p>Loading... {{ searchParams }}</p>
      <IntersectionObserver @intersect="intersected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchParams, SearchResult } from '~/server/types';

const getCurrentPage = () => {
  const pageNumber = parseInt(useRoute().query.page as string);
  return isFinite(pageNumber) ? pageNumber : 1;
};

const getImages = async (query: Partial<SearchParams>) => {
  const { data: result } = await useFetch<SearchResult>('/api/search', {
    params: query,
  });
  return result;
};

const page = ref(getCurrentPage());

const searchParams = ref({
  query: useRoute().params.query as string,
  page: page,
});

const loading = ref(false);

const searchResult = ref(await getImages(searchParams.value));

const intersected = async () => {
  if (loading.value) return;
  page.value++;
  loading.value = true;
  const nextSearchResult = await getImages(searchParams.value);
  searchResult.value.results.push(...nextSearchResult.value.results);
  loading.value = false;
};

onMounted(async () => {
  // setTimeout(() => page.value++, 1000);
});
</script>

<style lang="scss">
.header {
  text-align: center;
  padding: 32px;
}

.result-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.result-img {
  max-width: 32rem;
  margin-top: 0.5rem;
  vertical-align: middle;
}

.loading {
  text-align: center;
  margin: 2rem;
}
</style>
