<template>
  <div class="game">
    <HomeMenu msg="Vælg"/>
    <Options msg="⚙"/>
    <Solution msg="Solution"/>
    <Attempts msg="Attempts"/>
    <CodeButtons msg="CodeButtons"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeMenu from '@/components/HomeMenu.vue'
import Options from '@/components/Options.vue'
import Solution from '@/components/Solution.vue'
import Attempts from '@/components/Attempts.vue'
import CodeButtons from '@/components/CodeButtons.vue'

export default {
  name: 'Game',
  components: {
    HomeMenu,
    Options,
    Solution,
    Attempts,
    CodeButtons
  }
}
</script>
