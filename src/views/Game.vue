<template>
  <div v-if="!getLoginStatus" class="game">
    <LoginRegister/>
  </div>
  <div v-else class="game">
    <HomeMenu />
    <Options msg="⚙"/>
    <Solution msg="Solution"/>
    <Attempts msg="Attempts"/>
    <CodeButtons msg="CodeButtons"/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginRegister from '@/components/LoginRegister.vue'
import HomeMenu from '@/components/HomeMenu.vue'
import Options from '@/components/Options.vue'
import Solution from '@/components/Solution.vue'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'Game',
  components: {
    LoginRegister,
    HomeMenu,
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

<style lang="scss" scoped>
.game {
  margin: auto;
  width: 20%;
}
</style>