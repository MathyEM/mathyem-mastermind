<template>
  <div class="solution">
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
