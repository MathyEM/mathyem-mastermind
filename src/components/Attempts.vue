<template>
  <div class="attempts">
    <CodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :onClick="onClick"
      :attemptIndex="attemptIndex" 
      class="attempts-code-row"
      :class="{ active: (getCurrentAttempt == attemptIndex) }" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters, mapActions } from 'vuex'
import { socketConnection } from '../services/socketio.service.js'

export default {
  name: 'Attempts',
  components: {
    CodeRow
  },
  props: {
  },
  computed: {
    ...mapGetters({
      gameData: 'getCurrentRoom',
    }),
    ...mapGetters(['getCurrentAttempt']),
    ...mapActions(['updateAttempt'])
  },
  methods: {
    onClick(pieceIndex, attemptIndex) {
      console.log(pieceIndex, attemptIndex)
      console.log(this.gameData.attempts[attemptIndex])
      this.updateAttempt
      socketConnection
    }
  }

}
</script>

<style lang="scss">
$code-piece-size: calc(100vh / 12 - 1.5rem);

.attempts {
  display: grid;
  grid-template-columns: 100%;
  justify-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  width: 100%;

  .attempts-code-row {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    justify-content: space-between;
    gap: 1.5rem;

    .code-piece {
      justify-content: unset;
      width: unset;

      > div {
        margin: 0;
        width: $code-piece-size;
        aspect-ratio: 1 / 1;
      }
    }
  }
}
</style>
