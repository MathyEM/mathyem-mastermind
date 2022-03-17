<template>
  <div class="room-list-btn" @click="toggleMenus"><span>≡</span> {{ title }}</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'RoomListButton',
	components: {
	},
  props: {
    title: {
      required: true,
      type: String
    }
  },
	data() {
		return {
		}
	},
	computed: {
    ...mapGetters(['getShowRoomList', 'getShowOptions'])
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST', 'SET_SHOW_OPTIONS']),
    ...mapActions(['setShowRoomList']),
    toggleMenus(event) {
      this.setShowRoomList()
      this.SET_SHOW_OPTIONS(false)
      event.stopPropagation()
    }
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
.room-list-btn {
  font-weight: bold;
  user-select: none;
  cursor: pointer;

  span {
    font-size: 1.2em;
  }
}
</style>
