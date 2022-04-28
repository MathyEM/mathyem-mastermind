<template>
  <div class="singleplayer game">
    <Solution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!getReviewingPreviousRound" />
      <NextRoundButton v-else />
    </div>
    <Attempts />
    <SPCodeButtons :singleplayer="true" />
  </div>
</template>

<script>
// @ is an alias to /src
import Solution from '@/components/Solution.vue'
import GameStatus from '@/components/GameStatus.vue'
import NextRoundButton from '@/components/subcomponents/NextRoundButton'
import Attempts from '@/components/Attempts.vue'
import SPCodeButtons from '@/components/singleplayer/SPCodeButtons.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SinglePlayer',
  components: {
    Solution,
    GameStatus,
    NextRoundButton,
    Attempts,
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
  height: 100%;
}
</style>