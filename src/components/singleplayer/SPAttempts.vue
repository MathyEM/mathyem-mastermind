<template>
  <div class="attempts">
    <SPCodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :onClick="onClick"
      :attemptIndex="attemptIndex" 
      class="attempts-code-row" />
  </div>
</template>

<script>
import SPCodeRow from '@/components/singleplayer/subcomponents/SPCodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'SPAttempts',
  components: {
    SPCodeRow,
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCurrentAttempt', 'getSolutionState', 'getCurrentRoom', 'getReviewingPreviousRound', 'getPreviousRound']),
    gameData: {
      get: function () {
        if (this.SPGetReviewingPreviousRound == true) {
          return this.SPGetPreviousRound
        }
        return this.SPGetCurrentRoom
      }
    }
  },
  methods: {
    onClick(pieceIndex, attemptIndex) {
      console.log(pieceIndex, attemptIndex, attemptIndex+1)
    }
  }

}
</script>

<style lang="scss">

</style>
