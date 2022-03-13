<template>
  <div v-if="!getLoginStatus" class="main">
    <LoginRegister/>
  </div>
  <div v-else-if="getLoginStatus && getCurrentRoom.id === ''" class="main">
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
  computed: {
    ...mapGetters(['getLoginStatus', 'getCurrentRoom', 'getUserId', 'getUsername', 'getGameStatus']),
  }
}
</script>

<style lang="scss">
.main {
  margin: auto;
  margin-top: 0;
  width: 300px;

  .login-register {
    margin-top: 4rem;
  }
  
  .join-create-room, .login-register {
    input, button {
      box-sizing: border-box;
      width: 100%;
      font-size: 1rem;
      height: 2rem;
      text-align: center;
    }

    input {
      height: 2.2rem;
      vertical-align: middle;
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
    width: 100%;
    padding: 0 1rem;
  }
}
</style>