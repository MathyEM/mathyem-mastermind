<template>
  <div v-if="getSessionLoading" class="main loading">
    <img :src="loading" alt="">
  </div>
  <div v-else-if="!getLoginStatus" class="main login-screen">
    <h2>{{ title }}</h2>
    <LoginRegister/>
  </div>
  <div v-else-if="getLoginStatus && getCurrentRoom.id === ''" class="main">
    <h2>{{ title }}</h2>
    <CreateJoinRoom />
    <PushNotification v-if="!getPushSubscription" />
  </div>
  <div v-else class="main game">
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
import LoginRegister from '@/components/LoginRegister.vue'
import CreateJoinRoom from '@/components/CreateJoinRoom.vue'
import Scores from '@/components/Scores.vue'
import Solution from '@/components/Solution.vue'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'
import GameStatus from '@/components/GameStatus.vue'
import NextRoundButton from '@/components/subcomponents/NextRoundButton'
import PushNotification from '@/components/PushNotification.vue'
import { socketConnection } from '@/services/socketio.service.js'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    CreateJoinRoom,
    Scores,
    Solution,
    Attempts,
    CodeButtons,
    GameStatus,
    NextRoundButton,
    PushNotification,
  },
  data() {
    return {
      title: 'Mastermind Game',
      loading: require('@/assets/Spinner-1s-357px.svg'),
    }
  },
  computed: {
    ...mapGetters([
      'getSessionLoading',
      'getLoginStatus',
      'getCurrentRoom',
      'getUserId',
      'getUsername',
      'getGameStatus',
      'getPushSubscription',
      'getSWRegistration',
      'getReviewingPreviousRound',
    ]),
  },
  methods: {
    ...mapActions(['socketLogin', 'setRegistrationAndPushSubscription']),
  },
  async created() {
    await this.setRegistrationAndPushSubscription()
    const onWindowOpen = () => {
      if (!this.getCurrentRoom._id) {
        return
      }
      this.socketLogin()
      socketConnection.enterRoom(this.getCurrentRoom._id)
    }
    window.addEventListener('focus', onWindowOpen)
    window.addEventListener('focus', async () => {
      if (!await this.getSWRegistration) {
        return
      }
      const reg = await this.getSWRegistration
      const notifications = await reg.getNotifications()
      if (notifications.length > 0) {
        notifications.forEach(async notification => {
          await notification.close()
        })
      }
    })
  },
}
</script>

<style lang="scss">
.main {
  margin: auto;
  margin-top: 0;
  width: 100%;
  padding: 0 0.5rem 0;

  h2 {
    margin-top: 0;
  }

  &.login-screen {
    margin-top: 2rem;
  }
  
  .join-create-room, .login-register {
    input, button {
      box-sizing: border-box;
      width: 100%;
      font-size: 1.1rem;
      height: 2.6rem;
      text-align: center;
    }
  }
}

.game {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  height: 100%;
}

@media only screen and (max-width: 320px) {
  .main {
    margin: auto;
    margin-top: 0;
    width: 100%;
    padding: 0 1rem;
  }
}
</style>