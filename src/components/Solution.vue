<template>
  <div class="solution">
    <CodeRow
      :code="getLocalSolution"
      :onClick="onClick"
      :class="{ active: !getSolutionState }" />
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
    ...mapGetters(['getLocalSolution', 'getSolutionState', 'getCodeMaker'])
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
