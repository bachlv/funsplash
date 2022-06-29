<template>
  <div class="home">
    <div class="home-content">
      <h1 class="logo">Funsplash</h1>
      <form
        class="searchbox"
        action="/search"
        @submit.prevent="submitSearchRequest"
      >
        <input type="text" v-model="query" placeholder="Search images" />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      query: '',
      params: {},
    };
  },

  methods: {
    submitSearchRequest() {
      navigateTo({
        path: '/search/' + this.query.trim().replace(/ +/g, '-'),
      });
    },
  },
};
</script>

<style lang="scss">
.home {
  height: 100vh;
  display: flex;
  justify-content: center;
}

.home-content {
  align-self: center;
  text-align: center;
  padding: 1rem;
  width: 100%;
}

.logo {
  margin: 0;
}

.searchbox {
  padding: 2rem 0 2rem 0;
  input {
    width: inherit;
    height: 3.5rem;
    font-size: large;
  }
}
</style>
