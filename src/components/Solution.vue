<template>
  <div class="solution">
    <h1>{{ msg }}</h1>
    <CodeRow :code="gameData.solution" :onClick="onClick" />
  </div>
</template>

<script>
import CodeRow from '@/components/subcomponents/CodeRow.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Solution',
  components: {
    CodeRow
  },
  props: {
    msg: String
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters({
      gameData: 'getGameData'
    })
  },
  methods: {
    onClick(index) {
      console.log(index)
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
