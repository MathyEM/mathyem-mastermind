<template>
  <div class="singleplayer game">
    <SPSolution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!SPGetReviewingPreviousRound" />
      <NextRoundButton v-else />
    </div>
    <SPAttempts />
    <SPCodeButtons :singleplayer="true" />
  </div>
</template>

<script>
// @ is an alias to /src
import SPSolution from '@/components/singleplayer/SPSolution.vue'
import GameStatus from '@/components/GameStatus.vue'
import NextRoundButton from '@/components/subcomponents/NextRoundButton'
import SPAttempts from '@/components/singleplayer/SPAttempts.vue'
import SPCodeButtons from '@/components/singleplayer/SPCodeButtons.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SinglePlayer',
  components: {
    SPSolution,
    GameStatus,
    NextRoundButton,
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
.singleplayer.game {
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  margin-top: 2rem;
  height: 100%;
}
</style>