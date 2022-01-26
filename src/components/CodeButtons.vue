<template>
  <div class="code-buttons">
    <CodeRow ref="code-buttons" :code="gameData.codeSet" :onClick="onClick" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CodeButtons',
  components: {
    CodeRow,
  },
  props: {
  },
  computed: {
    ...mapGetters({
      gameData: 'getCurrentRoom'
    })
  },
  methods: {
    onClick(index) {
      console.log(index)
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
