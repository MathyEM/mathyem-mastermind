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
.attempts {
  display: grid;
  // grid-template-rows: repeat(10, 1fr);
  padding: 2rem 0;
  width: 100%;
  // height: 100%;
  gap: 0.4rem;

  .attempts-code-row {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    justify-content: space-evenly;
    gap: 0.5rem;

    .code-piece {
      display: block;
      border-color: red;
      height: 100%;
      position: relative;
      justify-content: unset;
      width: unset;

      > div {
        display: block;
        margin: 0;
        aspect-ratio: 1 / 1;
      }
    }
  }
}
</style>
