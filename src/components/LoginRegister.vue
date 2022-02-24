<template>
  <div class="login-register">
    <form v-on:submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Username" minlength="4">
      <input v-if="getRegisteringState" v-model="email" type="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password" minlength="6">
      <button v-if="!getRegisteringState" @click="login" type="submit">Login</button>
      <button v-if="!getRegisteringState" @click="TOGGLE_REGISTERING_STATE">Register new account</button>
      <button v-if="getRegisteringState" @click="register" type="submit">Register</button>
    </form>
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
    onSubmit() {
      return false
    },
		login() {
			console.log('login clicked')
      if (this.password.length < 6 || this.username.length < 4) {
        return
      }
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
      if (this.password.length < 6 || this.username.length < 4) {
        return
      }
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
