<template>
  <div class="attempts">
    <CodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :onClick="onClick"
      :attemptIndex="attemptIndex" 
      class="attempts-code-row" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Attempts',
  components: {
    CodeRow
  },
  props: {
  },
  computed: {
    ...mapGetters({
      gameData: 'getGameData'
    })
  },
  methods: {
    onClick(pieceIndex, attemptIndex) {
      console.log(pieceIndex, attemptIndex)
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
    gap: unset;

    .code-piece {
      border-color: red;
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
