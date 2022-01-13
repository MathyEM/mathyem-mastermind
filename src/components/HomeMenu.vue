<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3>your id is {{ getSocketId }}</h3>
			<input v-model="roomName" type="text" placeholder="Name your new room or enter join code"><br/>
			<button @click="createRoom">Create Room</button>
			<button @click="joinRoom">Join Room</button>
		</div>
		<LoginRegister v-else />
  </div>
</template>

<script>
import { guestSocket, userSocket } from '@/services/socketio.service.js'
import LoginRegister from './LoginRegister.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HomeMenu',
	components: {
		LoginRegister,
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
			if (!this.getLoginStatus) {
				guestSocket.createRoom(this.roomName)
				return
			}
			userSocket.createRoom(this.roomName)
    },
    joinRoom() {
			console.log()
			guestSocket.joinRoom(this.roomName)
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
