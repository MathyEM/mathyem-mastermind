<template>
  <div v-if="!getLoginStatus" class="main">
    <h2>{{ title }}</h2>
    <LoginRegister/>
  </div>
  <div v-else-if="getLoginStatus && getCurrentRoom.id === ''" class="main">
    <h2>{{ title }}</h2>
    <CreateJoinRoom />
  </div>
  <div v-else class="main game">
    <Scores />
    <Solution />
    <GameStatus />
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

import { mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    CreateJoinRoom,
    Scores,
    Solution,
    Attempts,
    CodeButtons,
    GameStatus
  },
  data() {
    return {
      title: 'Mastermind Game'
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getCurrentRoom', 'getUserId', 'getUsername', 'getGameStatus']),
  }
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