<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<h2>Welcome {{ getUsername }}!</h2>
			<h3 v-if="getCurrentRoom.id != ''">Room: {{ getCurrentRoom.name }}</h3>
			<form v-on:submit.prevent="onSubmit">
				<input v-model="roomName" type="text" placeholder="Name your new room or enter room code"><br/>
				<div v-if="getCreateJoinRoomAnyError || this.$v.$error" class="create-join-errors">
					<div v-if="getAlreadyInRoomError" class="create-join-error">
						{{ getCreateJoinRoomErrors.alreadyInRoom['EN'] }}
					</div>
					<div v-if="this.$v.$error" v-html="getCreateJoinRoomErrors.minMax['EN']" class="create-join-error">
						{{ getCreateJoinRoomErrors.minMax['EN'] }}
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
import { mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
import { minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'CreateJoinRoom',
	components: {
	},
  props: {
  },
	data() {
		return {
		}
	},
	validations() {
    return {
      roomName: {
        minLength: minLength(this.getCreateRoomMinLength),
        maxLength: maxLength(this.getCreateRoomMaxLength),
      }
		}
	},
	computed: {
		...mapGetters([
			'getRoomName',
			'getUsername',
			'getCurrentRoom',
			'getLoginStatus',
			'getCreateJoinRoomAnyError',
			'getCreateJoinRoomErrors',
			'getAlreadyInRoomError',
			'getCreateRoomMinLength',
			'getCreateRoomMaxLength',
		]),
		roomName: {
      get() { return this.getRoomName },
      set(roomName) {
        this.$v.roomName.$touch()
        this.UPDATE_ROOM_NAME(roomName)
      }
    },
	},
  methods: {
		...mapMutations(['UPDATE_ROOM_NAME']),
		onSubmit() {
			return false
		},
		createRoom() {
			if (this.getRoomName.length < 1) {
				return
			}
			socketConnection.createRoom(this.getRoomName)
    },
    joinRoom() {
			if (this.getRoomName.length < 24) {
				return
			}
			socketConnection.joinRoom(this.getRoomName)
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
	text-align: left;

  .create-join-error {
    padding: 0.25rem;
    
    &:first-child:not(:last-child) {
      border-bottom: 1px solid darken(yellow, 15);
      
    }
  }
  
}
</style>
