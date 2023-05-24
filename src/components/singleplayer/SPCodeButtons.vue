<template>
  <div class="code-buttons">
    <!-- if the solution is set and they have codebreaker authority -->
    <SPCodeRow ref="code-buttons" :code="SPGetCodeSet" :onClick="onClick" :disabled="SPGetReviewingPreviousRound" class="code-buttons-code-row" />
  </div>
</template>

<script>
import SPCodeRow from '@/components/singleplayer/subcomponents/SPCodeRow'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SPCodeButtons',
  components: {
    SPCodeRow,
  },
  props: {
  },
  computed: {
    ...mapGetters(['SPGetCodeSet', 'SPGetReviewingPreviousRound']),
  },
  methods: {
    ...mapActions(['SPUpdateAttempt']),
    onClick(index) {
      console.log(index);
      this.SPUpdateAttempt(index)
      return
    }
  }
}
</script>

<style lang="scss">

</style>
