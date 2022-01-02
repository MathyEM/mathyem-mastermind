<template>
  <div class="code-buttons">
    <h1>{{ msg }}</h1>
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
    msg: String
  },
  computed: {
    ...mapGetters({
      gameData: 'getGameData'
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
