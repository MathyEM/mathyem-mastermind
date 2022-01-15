<template>
  <div v-if="!getLoginStatus" class="game">
    <LoginRegister/>
  </div>
  <div v-else class="game">
    <CreateJoinRoom />
    <Options msg="⚙"/>
    <Solution msg="Solution"/>
    <Attempts msg="Attempts"/>
    <CodeButtons msg="CodeButtons"/>
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

import { mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    CreateJoinRoom,
    Options,
    Solution,
    Attempts,
    CodeButtons
  },
  computed: {
    ...mapGetters(['getLoginStatus']),
  }
}
</script>

<style lang="scss">
.game {
  margin: auto;
  width: 300px;
  
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

@media only screen and (max-width: 500px) {
  .game {
    margin: auto;
    width: 100%;
  }
}

</style>