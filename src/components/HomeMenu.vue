<template>
  <div class="home-menu">
		<div v-if="getLoginStatus" class="join-create-room">
			<input v-model="roomName" type="text" placeholder="Navn på nyt rum/kode til eksisterende"><br/>
			<button @click="createRoom">Opret Rum</button>
			<button @click="joinRoom">Tilslut Rum</button>
		</div>
		<LoginRegister v-else />
  </div>
</template>

<script>
import SocketioService from '@/services/socketio.service.js'
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
		...mapGetters(['getUsername', 'getCurrentRoom', 'getGameData', 'getLoginStatus'])
	},
  methods: {
		createRoom() {
			console.log();
			SocketioService.createRoom(this.roomName)
    },
    joinRoom() {
			console.log();
			SocketioService.joinRoom(this.roomName)
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
