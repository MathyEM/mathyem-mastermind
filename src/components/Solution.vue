<template>
  <div class="solution">
    <h1>{{ msg }}</h1>
    <CodeRow :code="code" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'

export default {
  name: 'Solution',
  components: {
    CodeRow
  },
  props: {
    msg: String
  },
  data() {
    return {
      code: [1, 2, 3, 4]
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
