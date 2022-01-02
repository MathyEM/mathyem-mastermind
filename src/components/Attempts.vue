<template>
  <div class="attempts">
    <h1>{{ msg }}</h1>
    <CodeRow
      v-for="(attempt, attemptIndex) in gameData.attempts"
      :key="attemptIndex"
      :code="attempt"
      :onClick="onClick"
      :attemptIndex="attemptIndex" />
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
    msg: String
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

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
