<template>
  <div
    class="search-box-container"
    :class="{ expanded: page === 'home', collapsed: page !== 'home' }"
  >
    <div class="branding" v-if="page === 'home'">
      <NuxtLink to="/"><Logo class="logo" /></NuxtLink>
      <h1 v-if="page === 'home'" class="wordmark">Funsplash</h1>
    </div>
    <NuxtLink to="/" v-else class="branding"><Logo class="logo" /></NuxtLink>

    <form
      class="search-box"
      :class="{ 'ac-loading': isAcFetching, invalid: isQueryInvalid }"
      @submit.prevent="submitSearchRequest"
      key="search-box"
    >
      <input
        type="text"
        ref="searchInput"
        v-model="query"
        placeholder="Search images"
        @focus="() => (isAcEnabled = true)"
        @keydown.tab="() => (isAcEnabled = false)"
        @input="resetAutocomplete"
        @keydown.up.prevent="onArrowUp"
        @keydown.down.prevent="onArrowDown"
        autocomplete="off"
      />

      <button type="submit" class="search-button" ref="searchButton">
        <IconSearch />
      </button>

      <ul v-show="shouldOpen" ref="autocomplete" class="autocomplete">
        <li
          class="autocomplete-item"
          v-for="(item, index) in autocomplete"
          :class="{ active: index === acSelectionIndex }"
          :key="item"
          @click="handleClickSelection(index)"
          @mouseenter="() => (acSelectionIndex = index)"
        >
          {{ item }}
        </li>
      </ul>
    </form>
  </div>
</template>

<script lang="ts">
import { ApiAutocomplete } from 'types';

export default {
  data() {
    return {
      query: this.getQueryFromPath(),
      oldQuery: '',
      isQueryInvalid: false,
      isAcEnabled: false,
      isAcPending: false,
      isAcFetching: false,
      isInputFocusedOut: false,
      autocomplete: [],
      acSelectionIndex: -1,
    };
  },

  computed: {
    page: {
      get() {
        const pageLocation = useState('page').value;
        if (pageLocation) return pageLocation;
        if (this.$route.path === '/') return 'home';
      },
    },

    selectionRange: {
      get() {
        return this.autocomplete.length;
      },
    },

    shouldOpen: {
      get() {
        if (!this.query || !this.autocomplete.length) return false;
        if (this.isAcEnabled && this.autocomplete.length) return true;
        return this.isAcEnabled;
      },
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },

  unmounted() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  methods: {
    navigate(keyword: string) {
      navigateTo('/search/' + keyword.trim().replace(/ +/g, '-'));
      this.isAcEnabled = false;
      this.$refs.searchInput.blur();
      this.$refs.searchButton.blur();
    },
    submitSearchRequest() {
      console.log(this.$route);
      if (!this.query) {
        this.isQueryInvalid = true;
        setTimeout(() => (this.isQueryInvalid = false), 500);
        return;
      }
      this.navigate(this.query);
    },
    getQueryFromPath() {
      const query = this.$route.path.split('/')[2]?.replace('-', ' ');
      return query ? decodeURIComponent(query) : '';
    },

    handleSelection() {
      if (this.acSelectionIndex >= 0) {
        if (!this.oldQuery) this.oldQuery = this.query;
        this.query = this.autocomplete[this.acSelectionIndex];
        this.isAcPending = true;
      } else {
        this.query = this.oldQuery;
        this.oldQuery = '';
        this.isAcPending = false;
      }
    },
    handleClickSelection(index: number) {
      this.acSelectionIndex = index;
      this.handleSelection();
      this.submitSearchRequest();
    },

    handleClickOutside(event: Event) {
      if (this.$refs.autocomplete.contains(event.target)) return;
      if (this.$refs.searchInput.contains(event.target)) {
        this.isAcEnabled = true;
        return;
      }
      this.isAcEnabled = false;
      this.acSelectionIndex = -1;
    },

    onArrowUp() {
      if (this.acSelectionIndex >= 0) this.acSelectionIndex -= 1;
      this.handleSelection();
    },
    onArrowDown() {
      if (this.acSelectionIndex < this.selectionRange - 1)
        this.acSelectionIndex += 1;
      this.handleSelection();
    },
    resetAutocomplete() {
      this.acSelectionIndex !== -1;
      this.isAcPending = false;
    },
  },

  watch: {
    query: async function (keyword: string) {
      if (!keyword || this.isAcPending) return;

      this.isAcPending = true;
      this.isAcFetching = true;
      this.acSelectionIndex = -1;

      const { data, error } = await useFetch(
        '/api/autocomplete/' + encodeURI(keyword)
      );
      if (error.value) this.autocomplete = [];
      else this.autocomplete = (<ApiAutocomplete>data.value).autocomplete;

      this.isAcPending = false;
      this.isAcFetching = false;
    },
  },
};
</script>

<style lang="scss">
.search-box-container {
  display: flex;
  position: relative;
  height: 3.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.expanded {
  height: 80vh;
  margin: 2rem;
  .branding {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem;
    .logo {
      height: 4rem;
      margin: 0 auto;
    }
  }
}

.collapsed {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  border-bottom: var(--border-width) solid var(--color-accent);
  background-color: white;
  padding: 0.5rem;
  .branding {
    height: inherit;
    max-height: 3.5rem;
    padding: inherit;
    .logo {
      padding: 0.1rem;
      height: 100%;
    }
  }
}

.wordmark {
  margin: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.0625rem;
}

.search-box {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 3.5rem;
  max-width: 36rem;
  font-size: 1rem;
  font-weight: 400;
  padding-right: 3.75rem;
  transition: all 0.2s ease;
  background-color: white;
  border-radius: var(--border-radius);

  &.invalid {
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  &::before {
    content: '';
    position: absolute;
    border-radius: var(--border-radius);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: add, add;
    mask-composite: exclude;
    background: var(--color-accent);
    padding: var(--border-width);
    width: 100%;
    pointer-events: none;
  }

  &.ac-loading {
    @keyframes ac-loading {
      from {
        background-position: 0 0;
      }
      to {
        background-position: -200% 0;
      }
    }
    &::before {
      background: linear-gradient(90deg, #fff, #000 20%, #000 80%, #fff);
      background-size: 200% auto;
      animation: ac-loading 1s linear infinite;
    }
  }

  input {
    width: 100%;
    height: 100%;
    font-size: inherit;
    font-weight: inherit;
    border: none;
    padding-inline: 1.25rem;
    background: none;
    outline: none;
  }

  .search-button {
    fill: gray;
    position: absolute;
    top: 0;
    width: 3.75rem;
    height: 100%;
    background-color: unset;
    border: none;
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    outline: none;
    transition: all 0.2s ease-out;
    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.1);
      fill: black;
    }

    svg {
      max-width: 1.5rem;
      margin-top: 0.25rem;
      margin: 0.125rem auto 0;
    }
  }

  .autocomplete {
    position: absolute;
    display: block;
    box-sizing: content-box;
    width: calc(100% - 0.5px);
    overflow-y: scroll;
    padding: 0.5rem 0 0.5rem;
    margin-left: calc(-1 * var(--border-width));
    background-color: white;
    border: var(--border-width) solid gray;
    border-radius: 4px;
    z-index: 10;
  }

  .autocomplete-item {
    padding: 1rem 1.25rem 1rem 1.25rem;
    cursor: pointer;
    &.active {
      background-color: #0000000f;
    }
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
}
</style>
