<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3 v-if="getCurrentRoom.id != ''">Room: {{ getCurrentRoom.name }}</h3>
			<form v-on:submit.prevent="onSubmit">
				<input v-model="roomName" type="text" placeholder="Name your new room or enter room code" minlength="3"><br/>
				<div v-if="getCreateJoinRoomAnyError" class="create-join-errors">
					<div v-if="getAlreadyInRoomError" class="create-join-error">
						{{ getCreateJoinRoomErrors.alreadyInRoom['EN'] }}
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
		...mapGetters(['getUsername', 'getCurrentRoom', 'getLoginStatus', 'getCreateJoinRoomAnyError', 'getCreateJoinRoomErrors', 'getAlreadyInRoomError'])
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
.create-join-errors {
  margin-top: -1px;
  background: rgba($color: yellow, $alpha: 0.8);
  border: 1px solid darken(yellow, 15);
  border-top: none;
  font-size: 0.9rem;

  .create-join-error {
    padding: 0.25rem;
    
    &:first-child:not(:last-child) {
      border-bottom: 1px solid darken(yellow, 15);
      
    }
  }
  
}
</style>
