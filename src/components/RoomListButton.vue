<template>
  <div class="room-list-btn" @click="SET_SHOW_ROOM_LIST(!getShowRoomList)"><span>≡</span> {{ title }}</div>
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
    ...mapGetters(['getShowRoomList'])
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST'])
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
.room-list-btn {
  font-weight: bold;
  cursor: pointer;

  span {
    font-size: 1.3em;
  }
}
</style>
