<template>
  <div>
    <SearchBox />
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

html,
body {
  box-sizing: border-box;
  margin: 0;
  font-family: var(--sans-serif);
  font-size: 16px;
  font-feature-settings: 'kern' on;
}

a {
  color: unset;
  text-decoration: unset;
}

ul {
  list-style: none;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

:root {
  --sans-serif: -apple-system, Pretendard, system-ui, sans-serif;
  --border-radius: 0.25rem;
  --border-width: 1px;
  --color-primary: black;
  --color-accent: rgba(0, 0, 0, 0.15);
  --color-accent-bg: rgba(0, 0, 0, 0.05);
  --screen-sm: 640px;
  --screen-xl: 1280px;
  --screen-2xl: 1536px;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s ease-out;
}

.page-enter,
.page-leave-active {
  opacity: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
}

@keyframes loading {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
