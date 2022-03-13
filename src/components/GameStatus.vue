<template>
  <div class="game-status">
    <p>{{ getGameStatus['EN'] }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'

export default {
  name: 'GameStatus',
  components: {
    
  },
  computed: {
    ...mapGetters(['getSolutionState', 'getCodeMaker', 'getRoomUsers', 'getGameStatus']),
  }
}
</script>

<style lang="scss">
.game-status {
  p {
    margin: 0.8rem 0;
  }
}

</style>