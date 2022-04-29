<template>
  <div v-if="!attemptIndex && attemptIndex !== 0" class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index1) in code" :key="index1" ref="code-piece" @click="onClick(index1, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
  <div v-else class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index2) in gameData.attempts[attemptIndex]" :key="index2" ref="code-piece" @click="onClick(index2, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
    <div
    class="accuracy-hints"
    :class="{ showAccuracyHint: (gameData.accuracyHints[attemptIndex].correctPieceCount !== undefined) }"
    v-if="gameData.accuracyHints !== undefined && gameData.accuracyHints[attemptIndex].correctPieceCount !== undefined">
      <div class="hint correctPosition" v-for="correctPositionCount in (gameData.accuracyHints[attemptIndex].correctPositionCount)" :key="'position'+correctPositionCount"></div>
      <div class="hint correctPiece" v-for="correctPieceCount in (Math.max((gameData.accuracyHints[attemptIndex].correctPieceCount-gameData.accuracyHints[attemptIndex].correctPositionCount), 0))" :key="'piece'+correctPieceCount"></div>
    </div>
    <div v-else-if="getSPCurrentAttempt == attemptIndex && !getSPReviewingPreviousRound" class="undo-attempt">
      <button @click="undoAttemptPiece">
        <span class="material-icons">undo</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'SPCodeRow',
  props: {
    code: Array,
    onClick: {
      required: true,
      type: Function
    },
    attemptIndex: Number,
    disabled: {
      default: false,
      type: Boolean,
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getSPCurrentRoom',
      'getSPCurrentAttempt',
      'getSPReviewingPreviousRound',
      'getSPPreviousRound',
      ]),
    gameData: {
      get: function () {
        if (this.getSPReviewingPreviousRound == true) {
          return this.getSPPreviousRound
        }
        return this.getSPCurrentRoom
      }
    }
  },
  methods: {
    ...mapActions(['SPUndoAttemptPiece']),
  },
  created() {
      
  }
}
</script>

<style lang="scss">

</style>
