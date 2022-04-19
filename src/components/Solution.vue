<template>
  <div class="solution">
    <CodeRow
      :code="getSolution"
      :onClick="onClick"
      :class="{ active: (!getSolutionState && !getReviewingPreviousRound )}"
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
    ...mapGetters(['getLocalSolution', 'getSolutionState', 'getCodeMaker', 'getPreviousRound', 'getReviewingPreviousRound']),
    getSolution: {
      get: function () {
        if (this.getReviewingPreviousRound == true) {
          return this.getPreviousRound.solution
        }
        return this.getLocalSolution
      }
    }
  },
  methods: {
    onClick(index) {
      console.log(index)
    }
  }
}
</script>

<style lang="scss">
.solution-code-row {
  column-gap: $code-piece-column-gap;
  .code-piece {
    > div {
      @include code-piece-scaling(1.15)
    }
  }
}
.is-browser .solution-code-row {
  .code-piece {
    > div {
      @include code-piece-scaling(1.0)
    }
  }
}
</style>
