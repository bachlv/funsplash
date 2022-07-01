<template>
  <!-- <div class="branding" key="branding" v-if="page === 'home'">
    <Logo class="logo" />
    <h1 class="wordmark">Funsplash</h1>
  </div> -->
  <div class="search-box-container" :class="{ expanded: page === 'home' }">
    <form
      class="search-box"
      @submit.prevent="submitSearchRequest"
      key="search-box"
    >
      <input
        key="searchinput"
        type="text"
        v-model="query"
        placeholder="Search images"
      />

      <button type="submit" class="search-button">
        <IconSearch />
      </button>

      <ul v-show="autocomplete.length" class="autocomplete">
        <li
          v-for="item in autocomplete"
          :key="item"
          @click="navigate(item.query)"
          class="autocomplete-item"
        >
          {{ item.query }}
        </li>
      </ul>
    </form>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      query: '',
      params: {},
      autocomplete: [],
      loading: false,
      page: '',
    };
  },

  watch: {
    query: async function (keyword: string) {
      if (this.loading) return;
      this.loading = true;
      if (keyword === '') {
        this.autocomplete = [];
      } else {
        const { data, error } = await useFetch(
          '/api/autocomplete/' + encodeURI(keyword)
        );
        if (!error.value) this.autocomplete = data.value.autocomplete;
      }
      this.loading = false;
    },
  },

  created() {
    this.page = useState('page', () => 'home');
  },

  methods: {
    navigate(keyword: string) {
      navigateTo('/search/' + keyword.trim().replace(/ +/g, '-'));
      this.autocomplete = [];
    },
    submitSearchRequest() {
      this.navigate(this.query);
      this.autocomplete = [];
    },
  },
};
</script>

<style lang="scss">
.search-box-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 4rem;
  transition: all 0.2s ease;
  margin: 1rem;
  position: relative;
}

.expanded {
  height: 100%;
}

.branding {
  display: flex;
  flex-direction: column;
}

.logo {
  width: 4rem;
  margin: 0 auto;
}

.wordmark {
  margin: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.0625rem;
}

.search-box {
  position: relative;
  width: 100%;
  height: 3.5rem;
  max-width: 38rem;
  display: block;
  border-radius: 0.25rem;
  border: 2px solid grey;
  padding-right: 4rem;

  input {
    width: 100%;
    height: 100%;
    font-size: 1em;
    border: none;
    outline: none;
    padding-inline: 1.25rem;
    padding-right: 6rem;
    background: none;
    font-weight: 400;
    transition: border 0.2s ease-out;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  }

  .search-button {
    position: absolute;
    top: 0;
    width: 4rem;
    height: 100%;
    background-color: unset;
    border: none;

    svg {
      fill: gray;
      max-width: 2rem;
      margin-top: 0.25rem;
    }
  }

  .search-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .autocomplete {
    position: absolute;
    display: block;
    box-sizing: content-box;
    width: 100%;
    padding: 0;
    margin-left: -2px;
    margin-right: -2px;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    left: 0;
    background-color: white;
    border: 2px solid gray;
    border-radius: 4px;
    z-index: 10;
  }

  .autocomplete-item {
    padding: 1rem;
  }

  .autocomplete-item:hover {
    background-color: #0000000f;
  }
}
</style>
