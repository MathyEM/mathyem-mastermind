<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3>your id is {{ getSocketId }}</h3>
			<input v-model="roomName" type="text" placeholder="Name your new room or enter join code"><br/>
			<button @click="createRoom">Create Room</button>
			<button @click="joinRoom">Join Room</button>
		</div>
  </div>
</template>

<script>
import { socketConnection } from '@/services/socketio.service.js'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeMenu',
	components: {
	},
  props: {
  },
	data() {
		return {
			roomName: '',
		}
	},
	computed: {
		...mapGetters(['getUsername', 'getCurrentRoom', 'getGameData', 'getLoginStatus', 'getSocketId'])
	},
  methods: {
		createRoom() {
			console.log()
			socketConnection.createRoom(this.roomName)
    },
    joinRoom() {
			console.log()
			socketConnection.joinRoom(this.roomName)
    }
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
