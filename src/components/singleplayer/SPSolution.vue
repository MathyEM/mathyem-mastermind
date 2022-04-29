<template>
  <div class="solution">
    <SPCodeRow
      :code="getSolution"
      :onClick="onClick"
      :isSolution="true"
      class="solution-code-row" />
  </div>
</template>

<script>
import SPCodeRow from '@/components/singleplayer/subcomponents/SPCodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Solution',
  components: {
    SPCodeRow
  },
  props: {
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['SPGetSolution', 'SPGetPreviousRound', 'SPGetReviewingPreviousRound']),
    getSolution: {
      get: function () {
        if (this.SPGetReviewingPreviousRound == true) {
          return this.SPGetPreviousRound.solution
        }
        return this.SPGetSolution
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

</style>
