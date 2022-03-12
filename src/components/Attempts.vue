<template>
  <div class="attempts">
    <CodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :onClick="onClick"
      :attemptIndex="attemptIndex" 
      class="attempts-code-row"
      :class="{ active: (getCurrentAttempt == attemptIndex && getSolutionState) }" />
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
      gameData: 'getCurrentRoom',
    }),
    ...mapGetters(['getCurrentAttempt', 'getSolutionState']),
  },
  methods: {
    onClick(pieceIndex, attemptIndex) {
      console.log(pieceIndex, attemptIndex, attemptIndex+1)
    }
  }

}
</script>

<style lang="scss">
.attempts {
  display: grid;
  grid-template-columns: 100%;
  padding: 0;
  margin: auto;
  padding-bottom: 2rem;
  width: fit-content;
  row-gap: 0.6rem;

  .attempts-code-row {
    display: grid;
    grid-auto-flow: column;
    justify-items: center;
    justify-content: center;
    column-gap: 0.8rem;
  }
}
</style>
