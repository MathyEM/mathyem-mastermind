<template>
  <div class="code-buttons">
    <!-- if the solution is set and the then check if they have codebreaker authority -->
    <CodeRow v-if="getSolutionState" ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeBreakerAuthority" />
    <!-- if the solution is set do you have codemaker authority? -->
    <CodeRow v-else ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeMakerAuthority" />
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
    ...mapGetters(['getCodeSet', 'getSolutionState', 'hasCodeBreakerAuthority', 'hasCodeMakerAuthority']),
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
