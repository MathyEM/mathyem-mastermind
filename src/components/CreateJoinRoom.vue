<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<form v-on:submit.prevent="onSubmit">
				<input v-model="roomName" class="join-create-input" type="text" :placeholder="inputText"><br/>
				<div v-if="getCreateJoinRoomAnyErrorStatus || this.$v.$error || emptyInputError" class="create-join-errors">
					<div v-if="getAlreadyInRoomErrorStatus" class="create-join-error">
						{{ getCreateJoinRoomErrors.alreadyInRoom['EN'] }}
					</div>
					<div v-if="getInvalidJoinCodeErrorStatus" v-html="getCreateJoinRoomErrors.invalidJoinCode['EN']" class="create-join-error">
						{{ getCreateJoinRoomErrors.invalidJoinCode['EN'] }}
					</div>
					<div v-if="getInvalidJoinCodeLengthErrorStatus" v-html="getCreateJoinRoomErrors.invalidJoinCodeLength['EN']" class="create-join-error">
						{{ getCreateJoinRoomErrors.invalidJoinCodeLength['EN'] }}
					</div>
					<div v-if="this.$v.$error || emptyInputError" v-html="getCreateJoinRoomErrors.minMax['EN']" class="create-join-error1">
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
			inputText: 'Name a new room or join a room id',
			emptyInputError: false,
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
			'getCreateJoinRoomAnyErrorStatus',
			'getCreateJoinRoomErrors',
			'getAlreadyInRoomErrorStatus',
			'getInvalidJoinCodeErrorStatus',
			'getInvalidJoinCodeLengthErrorStatus',
			'getCreateRoomMinLength',
			'getCreateRoomMaxLength',
		]),
		roomName: {
      get() { return this.getRoomName },
      set(roomName) {
        this.$v.roomName.$touch()
        this.UPDATE_ROOM_NAME(roomName.trim())
				this.TOGGLE_CREATE_JOIN_ROOM_ANY_ERROR(false)
      }
    },
	},
  methods: {
		...mapMutations(['UPDATE_ROOM_NAME', 'TOGGLE_CREATE_JOIN_ROOM_ANY_ERROR', 'TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS']),
		onSubmit() {
			return false
		},
		createRoom() {
			if (this.$v.$error || !this.$v.$anyDirty) {
				if (!this.$v.$anyDirty) {
					this.emptyInputError = true
					this.TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS(false)
				}
				return
			}
			socketConnection.createRoom(this.getRoomName.trim())
    },
    joinRoom() {
			if (this.roomName.trim().length !== 24) {
        this.TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS(true)
				this.emptyInputError = false
        return
      }
			if (this.$v.$error) {
				return
			}
			socketConnection.joinRoom(this.getRoomName.trim())
    }
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
.join-create-room {
	input, button {
		margin-top: 0.5rem;
		border: 1px solid gray;
		border-radius: 0.2rem;
	}
}

.create-join-errors {
  margin-top: -1px;
	padding: 0.2rem;
  background: $orange;
  border: 1px solid darken($orange, 15);
  border-top: none;
  font-size: 0.9rem;
	text-align: left;

  .create-join-error {
    padding: 0.25rem;
    
    &:first-child:not(:last-child) {
      border-bottom: 1px solid darken($orange, 15);
      
    }
  }
  
}
</style>
