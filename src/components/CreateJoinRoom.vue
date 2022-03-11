<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3 v-if="getCurrentRoom.id != ''">Room: {{ getCurrentRoom.name }}</h3>
			<form v-on:submit.prevent="onSubmit">
				<input v-model="roomName" type="text" placeholder="Name your new room or enter room code" minlength="3"><br/>
				<div v-if="getCreateJoinRoomError" class="create-join-errors">
					<div class="create-join-error">

					</div>
				</div>
				<button @click="createRoom" type="submit">Create Room</button>
				<button @click="joinRoom" type="submit">Join Room</button>
			</form>
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
		...mapGetters(['getUsername', 'getCurrentRoom', 'getLoginStatus', 'getCreateJoinRoomError'])
	},
  methods: {
		onSubmit() {
			return false
		},
		createRoom() {
			if (this.roomName.length < 3) {
				return
			}
			socketConnection.createRoom(this.roomName)
    },
    joinRoom() {
			if (this.roomName.length < 3) {
				return
			}
			socketConnection.joinRoom(this.roomName)
    }
  },
	created() {
	}
}
</script>

<style scoped lang="scss">

</style>
