<template>
  <div class="code-buttons">
    <!-- if the solution is set and then check if they have codebreaker authority -->
    <CodeRow v-if="getSolutionState" ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeBreakerAuthority" class="code-buttons-code-row" />
    <!-- if the solution is set do you have codemaker authority? -->
    <CodeRow v-else ref="code-buttons" :code="getCodeSet" :onClick="onClick" :disabled="!hasCodeMakerAuthority" class="code-buttons-code-row" />
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

<style lang="scss">
$code-piece-size: calc(90vh / 11 - 1.5rem);
.code-buttons-code-row {
  height: auto;
  .code-piece {
    > div {
      width: $code-piece-size;
      height: $code-piece-size;
    }
  }
}
</style>
