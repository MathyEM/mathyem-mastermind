<template>
  <div class="home-menu">
			<button @click="createRoom">Create Room</button>
			<button @click="joinRoom">Join Room</button>
  </div>
</template>

<script>
import SocketioService from '@/services/socketio.service.js'

export default {
  name: 'HomeMenu',
  props: {
  },
  methods: {
		createRoom(e) {
			console.log(e);
			SocketioService.createRoom('create')
    },
    joinRoom(e) {
			console.log(e);
			SocketioService.joinRoom('join')
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
