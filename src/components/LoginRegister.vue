<template>
  <div class="login-register">
    <input v-model="username" type="text" placeholder="Username">
    <input v-if="getRegisteringState" v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <button v-if="!getRegisteringState" @click="login">Login</button>
    <button v-if="!getRegisteringState" @click="TOGGLE_REGISTERING_STATE">Register new account</button>
    <button v-if="getRegisteringState" @click="register">Register</button>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
    ...mapGetters(['getRegisteringState'])
  },
  methods: {
    ...mapActions(['socketLogin']),
    ...mapMutations(['TOGGLE_REGISTERING_STATE']),
		login() {
			console.log('login clicked')
      axios.post(process.env.VUE_APP_SOCKET_ENDPOINT + '/login', {username: this.username, email: this.email, password: this.password}, { withCredentials: true })
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
