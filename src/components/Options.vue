<template>
  <div class="options">
    <div class="options-icon">{{ title }} <span>⚙</span></div>
  </div>
</template>

<script>
export default {
  name: 'Options',
  props: {
    title: String
  }
}
</script>

<style scoped lang="scss">
.options-icon {
  font-weight: bold;

  span {
    font-size: 1.1em;
  }
}
</style>
