<template>
  <div class="attempts">
    <CodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :hints="gameData.accuracyHints[attemptIndex]"
      :onClick="onClick"
      :attemptIndex="attemptIndex" 
      class="attempts-code-row"
      :class="{ active: (getCurrentAttempt == attemptIndex && getSolutionState && !getReviewingPreviousRound) }" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Attempts',
  components: {
    CodeRow
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCurrentAttempt', 'getSolutionState', 'getCurrentRoom', 'getReviewingPreviousRound', 'getPreviousRound']),
    gameData: {
      get: function () {
        if (this.getReviewingPreviousRound == true) {
          return this.getPreviousRound
        }
        return this.getCurrentRoom
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
.attempts {
  display: grid;
  grid-template-columns: 100%;
  padding: 0;
  margin: auto;
  padding-bottom: 1.5rem;
  width: fit-content;
  row-gap: 0.4rem;

  .attempts-code-row {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    justify-content: center;
    column-gap: 0.6rem;
  }
}
@media screen and (max-width: 350px) {
  .attempts {
    row-gap: 0.4rem;
    .attempts-code-row{
      column-gap: 0.6rem;
    }
  }
}
</style>
