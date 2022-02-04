<template>
  <div class="code-buttons">
    <CodeRow ref="code-buttons" :code="getCodeSet" :onClick="onClick" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CodeButtons',
  components: {
    CodeRow,
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCodeSet', 'getSolutionState']),
  },
  methods: {
    ...mapActions(['updateAttempt', 'updateLocalSolution']),
    onClick(index) {
      if (this.getSolutionState) {
        this.updateAttempt(index)
        return
      }
      this.updateLocalSolution(index)
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
