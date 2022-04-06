<template>
  <div v-if="getCurrentRoom._id" class="game">
    <Scores />
    <Solution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!getReviewingPreviousRound" />
      <NextRoundButton v-else />
    </div>
    <Attempts />
    <CodeButtons />
  </div>
</template>

<script>
// @ is an alias to /src
import Scores from '@/components/Scores.vue'
import Solution from '@/components/Solution.vue'
import GameStatus from '@/components/GameStatus.vue'
import NextRoundButton from '@/components/subcomponents/NextRoundButton'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'

import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Room',
  components: {
    Scores,
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
  },
  methods: {
    ...mapMutations(['SET_SESSION_LOADING', 'SET_SHOW_ROOM_LIST']),
    ...mapActions(['enterRoom']),
  },
  async created() {
    if (this.$route.hash != '#nofetch') { // don't fetch room data if the join hash is set
      this.SET_SESSION_LOADING(true)
      this.enterRoom(this.$route.params.id)
      this.SET_SHOW_ROOM_LIST(false) // Hide room list after selecting a room
    } else {
      let href = window.location.href
      window.location = href.substring(0, href.lastIndexOf('#'))
    }
  },
}
</script>

<style lang="scss">
.game {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  height: 100%;
}
</style>