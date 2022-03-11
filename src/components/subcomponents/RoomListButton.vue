<template>
  <div class="room-list-btn" @click="toggleMenus"><span>≡</span> {{ title }}</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
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
    toggleMenus() {
      this.SET_SHOW_ROOM_LIST(!this.getShowRoomList)
      this.SET_SHOW_OPTIONS(false)
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
