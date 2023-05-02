<template>
  <div class="options-btn" @click="toggleMenus">
    <div class="options-icon">{{ title }}<span class="material-icons md-32">settings</span></div>
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
    toggleMenus(event) {
      this.SET_SHOW_OPTIONS(!this.getShowOptions)
      this.SET_SHOW_ROOM_LIST(false)
      event.stopPropagation()
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
  display: flex;
  align-items: center;
  
  span {
    padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  }
}
</style>
