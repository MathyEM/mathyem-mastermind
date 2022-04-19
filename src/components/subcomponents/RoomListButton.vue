<template>
  <div class="room-list-btn" @click="toggleMenus"><span class="material-icons md-32">menu</span>{{ title }}</div>
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
  display: flex;
  align-items: center;

  span {
    padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  }
}
</style>
