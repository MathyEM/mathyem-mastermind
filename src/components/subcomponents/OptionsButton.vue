<template>
  <div class="options">
    <div class="options-icon">{{ title }} <span>⚙</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'OptionsButton',
  props: {
    title: String
  },
  computed: {
    ...mapGetters(['getCurrentRoom'])
	},
}
</script>

<style scoped lang="scss">
.options-icon {
  font-weight: bold;

  span {
    font-size: 1.1em;
  }
}
</style>
