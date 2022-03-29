<template>
  <div class="next-round">
    <button @click="finishRoundReview">Continue to next round</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NextRoundButton',
  components: {
    
  },
  props: {
  },
  data() {
    return {
      
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['finishRoundReview'])
  }
}
</script>

<style scoped lang="scss">
.next-round {
  margin: 0.75rem;

  button {
    font-size: 1.1rem;
    height: 2em;
  }
}
</style>
