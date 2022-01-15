<template>
  <div class="login-register">
    <input v-model="username" type="text" placeholder="Username"><br/>
    <input v-model="email" type="email" placeholder="Email"><br/>
    <input v-model="password" type="password" placeholder="Password"><br/>
    <button @click="login">Login</button>
    <button @click="register">Register</button>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginRegister',
  props: {
  },
	data() {
		return {
			username: 'Mathy',
      email: 'test@test.com',
      password: 'budding1337',
		}
	},
	computed: {
    ...mapGetters(['getSocketId'])
  },
  methods: {
    ...mapActions(['socketLogin']),
		login() {
			console.log('login clicked')
      axios.post(process.env.VUE_APP_SOCKET_ENDPOINT + '/login', {socketId: this.getSocketId, username: this.username, email: this.email, password: this.password}, { withCredentials: true })
        .then((response) => {
          if (response.status !== 200) {
            console.log('status: ', response.status);
            return
          }
          this.socketLogin()
        })
    },
    register() {
			console.log('register clicked')
      axios.post(process.env.VUE_APP_SOCKET_ENDPOINT + '/register', {username: this.username, email: this.email, password: this.password}, { withCredentials: true })
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
