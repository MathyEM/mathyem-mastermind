<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3 v-if="getCurrentRoom.id != ''">Room: {{ getCurrentRoom.name }}</h3>
			<input v-model="roomName" type="text" placeholder="Name your new room or enter room code"><br/>
			<button @click="createRoom">Create Room</button>
			<button @click="joinRoom">Join Room</button>
		</div>
  </div>
</template>

<script>
import { socketConnection } from '@/services/socketio.service.js'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateJoinRoom',
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
		...mapGetters(['getUsername', 'getCurrentRoom', 'getLoginStatus'])
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

</style>
