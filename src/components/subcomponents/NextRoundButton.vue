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
  margin: 0.5rem;

  button {
    outline: none;
    border: none;
    height: 2em;
    font-size: 1.1rem;
    padding: 0 0.75rem;
    margin: 0;
    border-radius: $button-border-radius;
    background: $green;
    color: $text-color;
    box-shadow: $shadow-2dp;
    &:active {
			box-shadow: $shadow-1dp;
			background: $green-darkened;
		}
  }
}
</style>
