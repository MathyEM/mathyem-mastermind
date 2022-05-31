<template>
  <div class="tutorial game">
    <SPSolution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!SPGetReviewingPreviousRound" />
      <SPNextRoundButton v-else />
    </div>
    <SPAttempts />
    <SPCodeButtons />
  </div>
</template>

<script>
// @ is an alias to /src
import SPSolution from '@/components/singleplayer/SPSolution.vue'
import GameStatus from '@/components/GameStatus.vue'
import SPNextRoundButton from '@/components/singleplayer/subcomponents/SPNextRoundButton'
import SPAttempts from '@/components/singleplayer/SPAttempts.vue'
import SPCodeButtons from '@/components/singleplayer/SPCodeButtons.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SinglePlayer',
  components: {
    SPSolution,
    GameStatus,
    SPNextRoundButton,
    SPAttempts,
    SPCodeButtons,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'SPGetCurrentRoom',
      'SPGetReviewingPreviousRound',
    ]),
  },
  methods: {
    ...mapActions(['InitializeSinglePlayerGame']),
  },
  async created() {
    this.InitializeSinglePlayerGame()
  },
}
</script>

<style lang="scss">
.tutorial.game {
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  margin-top: 2rem;
  height: 100%;
}
</style>