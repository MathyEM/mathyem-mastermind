<template>
  <div class="singleplayer game">
    <Solution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!getReviewingPreviousRound" />
      <NextRoundButton v-else />
    </div>
    <Attempts />
    <CodeButtons :singleplayer="true" />
  </div>
</template>

<script>
// @ is an alias to /src
import Solution from '@/components/Solution.vue'
import GameStatus from '@/components/GameStatus.vue'
import NextRoundButton from '@/components/subcomponents/NextRoundButton'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SinglePlayer',
  components: {
    Solution,
    GameStatus,
    NextRoundButton,
    Attempts,
    CodeButtons,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentRoom',
      'getUserId',
      'getUsername',
      'getGameStatus',
      'getReviewingPreviousRound',
      'getShowRoomList',
    ]),
    roomId() {
      return this.$route.params.id
    },
  },
  methods: {
    ...mapMutations(['SET_SESSION_LOADING', 'SET_SHOW_ROOM_LIST']),
    ...mapActions(['InitializeSinglePlayerGame']),
  },
  async created() {

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