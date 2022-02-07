<template>
  <div v-if="!getLoginStatus" class="main">
    <LoginRegister/>
  </div>
  <div v-else-if="getLoginStatus && getCurrentRoom.id === ''" class="main">
    <div class="menus-container">
      <RoomListButton title="Rooms" />
      <RoomList />
      <Options msg="⚙"/>
    </div>
    <CreateJoinRoom />
  </div>
  <div v-else class="main game">
    <div class="menus-container">
      <RoomListButton title="Rooms" />
      <RoomList />
      <Options msg="⚙"/>
    </div>
    <Solution />
    <Attempts />
    <CodeButtons />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginRegister from '@/components/LoginRegister.vue'
import CreateJoinRoom from '@/components/CreateJoinRoom.vue'
import Options from '@/components/Options.vue'
import Solution from '@/components/Solution.vue'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'
import RoomListButton from '@/components/RoomListButton.vue'
import RoomList from '@/components/RoomList.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    CreateJoinRoom,
    Options,
    Solution,
    Attempts,
    CodeButtons,
    RoomListButton,
    RoomList
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getCurrentRoom', 'getUserId', 'getUsername']),
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
  grid-template-rows: auto auto 1fr auto;
  height: 100vh;
}

.menus-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

}

@media only screen and (max-width: 500px) {
  .main {
    margin: auto;
    width: 100%;
  }
}

</style>