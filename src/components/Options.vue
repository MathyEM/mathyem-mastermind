<template>
  <div class="options">
    <div class="options-icon">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'Options',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
.options-icon {
  font-size: 2rem;
  font-weight: bold;
}
</style>
