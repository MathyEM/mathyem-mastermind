<template>
  <div class="code-buttons">
    <h1>{{ msg }}</h1>
    <CodeRow ref="code-buttons" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'

export default {
  name: 'CodeButtons',
  components: {
    CodeRow,
  },
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
