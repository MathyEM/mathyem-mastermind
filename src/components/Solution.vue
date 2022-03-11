<template>
  <div class="solution">
    <CodeRow
      :code="getLocalSolution"
      :onClick="onClick"
      :class="{ active: !getSolutionState }"
      class="solution-code-row" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Solution',
  components: {
    CodeRow
  },
  props: {
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['getLocalSolution', 'getSolutionState', 'getCodeMaker'])
  },
  methods: {
    onClick(index) {
      console.log(index)
    }
  }
}
</script>

<style lang="scss">
// $code-piece-size: calc(90vh / 11 - 1.5rem);
// .solution-code-row {
//   height: auto;
//   .code-piece {
//     > div {
//       width: $code-piece-size;
//       height: $code-piece-size;
//     }
//   }
// }
</style>
