<template>
  <div class="Solution">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Solution',
  props: {
    msg: String
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
