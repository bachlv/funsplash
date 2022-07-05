<template>
  <div
    :style="{
      'grid-row-end': `span ${Math.ceil(
        (image.height / image.width) * (offsetWidth / gridGap)
      )}`,
    }"
  >
    <img :src="image.src.regular" @load="loadImage" class="result-img" />
  </div>
</template>

<script>
export default {
  props: ['image', 'gridGap'],
  data() {
    return {
      offsetWidth: 350,
      isLoaded: false,
    };
  },
  mounted() {
    this.offsetWidth = this.$el.offsetWidth;
  },
  methods: {
    loadImage() {
      this.isLoaded = true;
    },
  },
};
</script>

<style lang="scss">
.result-img {
  background-color: red;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
