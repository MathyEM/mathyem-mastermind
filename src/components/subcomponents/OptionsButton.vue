<template>
  <div class="options-btn" @click="toggleMenus">
    <div class="options-icon">{{ title }} <span>⚙</span></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'OptionsButton',
  props: {
    title: String
  },
  computed: {
    ...mapGetters(['getShowRoomList', 'getShowOptions'])
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST', 'SET_SHOW_OPTIONS']),
    toggleMenus() {
      this.SET_SHOW_OPTIONS(!this.getShowOptions)
      this.SET_SHOW_ROOM_LIST(false)
    }
  }
}
</script>

<style scoped lang="scss">
.options-btn {
  font-weight: bold;
  user-select: none;
  cursor: pointer;
}
.options-icon {
  span {
    font-size: 1.1em;
  }
}
</style>
