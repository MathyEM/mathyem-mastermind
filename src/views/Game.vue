<template>
  <div v-if="!getLoginStatus" class="main">
    <LoginRegister/>
  </div>
  <div v-else-if="getLoginStatus && getCurrentRoom.id === ''" class="main">
    <div class="menus-container">
      <RoomListButton title="Rooms" />
      <RoomList />
      <OptionsButton title="Options"/>
    </div>
    <CreateJoinRoom />
  </div>
  <div v-else class="main game">
    <div class="menus-container">
      <RoomListButton title="Rooms" />
      <RoomList />
      <OptionsButton title="Options"/>
    </div>
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
import OptionsButton from '@/components/subcomponents/OptionsButton.vue'
import Scores from '@/components/Scores.vue'
import Solution from '@/components/Solution.vue'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'
import RoomListButton from '@/components/subcomponents/RoomListButton.vue'
import RoomList from '@/components/RoomList.vue'
import GameStatus from '@/components/GameStatus.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    CreateJoinRoom,
    OptionsButton,
    Scores,
    Solution,
    Attempts,
    CodeButtons,
    RoomListButton,
    RoomList,
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

.menus-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 0.25rem;
  font-size: 1.5rem;
}

@media only screen and (max-width: 320px) {
  .main {
    margin: auto;
    width: 100%;
    padding: 0 1rem;
  }
}

</style>