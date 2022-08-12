<template>
  <div
    class="search-box-container"
    :class="{
      expanded: page === 'home',
      collapsed: page !== 'home',
      'result-loading': isImageLoading,
    }"
  >
    <div class="branding" v-if="page === 'home'">
      <NuxtLink to="/" tabindex="0"><Logo class="logo" /></NuxtLink>
      <h1 class="wordmark">Funsplash</h1>
    </div>
    <NuxtLink to="/" v-else class="branding"><Logo class="logo" /></NuxtLink>

    <form
      class="search-box"
      :class="{
        'ac-loading': isLoading,
        invalid: isQueryInvalid,
        focused: isInputFocused,
      }"
      @submit.prevent="submitSearchRequest"
    >
      <input
        type="text"
        ref="searchInput"
        v-model="query"
        placeholder="Search for any free stock image..."
        @focus="onInputFocus()"
        @blur="onInputBlur()"
        @input="resetAutocomplete"
        @keydown.up.prevent="onArrowUp"
        @keydown.down.prevent="onArrowDown"
        autocomplete="off"
      />

      <button
        type="submit"
        class="search-button"
        ref="searchButton"
        @focus="onInputFocus()"
        @blur="onInputBlur()"
        @keydown.tab="(e) => onInputBlur(e)"
      >
        <IconSearch />
      </button>

      <ul
        v-show="shouldOpen"
        ref="autocomplete"
        class="autocomplete"
        :class="{ active: acSelectionIndex !== -1 }"
      >
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
      isLoading: false,
      isInputFocused: false,
      autocomplete: [],
      acSelectionIndex: -1,
    };
  },

  setup() {
    const isImageLoading = useState('loading', () => false);
    return {
      isImageLoading,
    };
  },

  computed: {
    page: {
      get() {
        const pageLocation = useState('page').value;
        if (pageLocation) return pageLocation;
        if (this.$route.path === '/') return 'home';
        return '';
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
    window.scrollTo(0, 0);
    document.addEventListener('click', this.handleClickOutside);
    if (this.page === 'home') this.$refs.searchInput.focus();
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
      if (!this.query) {
        this.isQueryInvalid = true;
        setTimeout(() => (this.isQueryInvalid = false), 500);
        return;
      }
      this.navigate(this.query);
      if (this.$route.path === '/') this.isLoading = true;
    },
    getQueryFromPath() {
      if (this.$route.path.slice(0, 8) !== '/search/') return '';
      const query = this.$route.path.split('/')[2]?.replace(/-+/g, ' ');
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

    onInputFocus() {
      this.isAcEnabled = true;
      this.isInputFocused = true;
    },
    onInputBlur(e?: KeyboardEvent) {
      this.isInputFocused = false;
      if (e) {
        console.log(e);
        this.isAcEnabled = false;
      }
    },
  },

  watch: {
    query: async function (keyword: string) {
      if (!keyword || this.isAcPending) return;

      this.isAcPending = true;
      // this.isLoading = true;
      this.acSelectionIndex = -1;

      const { data, error } = await useFetch(
        '/api/autocomplete/' + encodeURI(keyword)
      );
      if (error.value) this.autocomplete = [];
      else this.autocomplete = (<ApiAutocomplete>data.value).autocomplete;

      this.isAcPending = false;
      this.isLoading = false;
    },

    '$route.path': function (path: string) {
      if (path !== '/') {
        this.isImageLoading = true;
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
@mixin before-loading-indicator {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: add, add;
  mask-composite: exclude;
  background: var(--color-accent);
  width: 100%;
  pointer-events: none;
}

@mixin before-loading-animation {
  transition: all;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    var(--color-accent) 30%,
    var(--color-accent) 70%,
    var(--color-primary)
  );
  background-size: 200% auto;
  animation: loading 1s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

.search-box-container {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  z-index: 1;
}

.wordmark {
  margin: 0.5rem;
  font-weight: 800;
  letter-spacing: -0.0625rem;
}

.expanded {
  position: absolute;
  width: 100%;
  top: 20%;
  left: 0;
  right: 0;
  height: 50%;
  padding: 2rem;

  .branding {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem;
    .logo {
      height: 4rem;
      margin: 0 auto;
      border-radius: var(--border-radius);
    }
  }

  .search-box {
    min-height: 3rem;
  }
}

.collapsed {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: fixed;
  top: 0;
  height: 3.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: white;

  &::before {
    @include before-loading-indicator;
    padding-bottom: var(--border-width);
  }
  &.result-loading {
    &::before {
      @include before-loading-animation;
      padding-bottom: 0.125rem;
    }
  }

  .branding {
    height: inherit;
    padding: inherit;
    &:focus {
      outline: var(--border-width) solid var(--color-primary);
      outline-offset: -0.375rem;
    }
  }
  .logo {
    height: 100%;
    max-height: 3rem;
    border-radius: var(--border-radius);
  }
}

.invalid {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
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
  border-radius: var(--border-radius);

  &.focused {
    background-color: unset;
    &::before {
      padding: var(--border-width);
    }
  }

  &:hover {
    &::before {
      padding: var(--border-width);
    }
  }

  &::before {
    transition: all 0.2s ease-out;
    border-radius: var(--border-radius);
    padding: var(--border-width);
    @include before-loading-indicator;
  }

  &.ac-loading {
    &::before {
      transition: all 0.2s ease-out;
      opacity: 1;
      @include before-loading-animation;
    }
  }

  input {
    width: 100%;
    height: inherit;
    font-size: inherit;
    font-weight: inherit;
    border: none;
    padding-inline: 1.25rem;
    background: none;
    outline: none;
  }
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
    fill: var(--color-primary);
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
  border: var(--border-width) solid var(--color-accent);
  border-radius: var(--border-radius);
  text-align: left;
  z-index: 10;
  transition: all 0.2s ease-out;
  &.active {
    box-shadow: var(--shadow-lg);
  }
}

.autocomplete-item {
  padding: 1rem 1.25rem 1rem 1.25rem;
  cursor: pointer;
  &.active {
    background-color: #0000000f;
  }
}
</style>
