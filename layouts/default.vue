<template>
  <div>
    <SearchBox />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const page = useState('page', () => '');
</script>

<style lang="scss">
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

html,
body {
  box-sizing: border-box;
  margin: 0;
  font-family: var(--sans-serif);
  font-size: 16px;
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
  --sans-serif: Pretendard, system-ui, sans-serif;
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
</style>
