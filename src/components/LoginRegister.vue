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

  },
  methods: {
		login() {
			console.log('login clicked')
      axios.post('http://'+process.env.VUE_APP_SOCKET_ENDPOINT + '/login', {username: this.username, email: this.email, password: this.password}, { withCredentials: true })
    },
    register() {
			console.log('register clicked')
      axios.post('http://'+process.env.VUE_APP_SOCKET_ENDPOINT + '/register', {username: this.username, email: this.email, password: this.password}, { withCredentials: true })
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
