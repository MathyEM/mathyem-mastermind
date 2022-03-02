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
			let currentUrl = window.location.pathname
      if (this.password.length < 6 || this.username.length < 4) {
        return
      }
      axios.post(process.env.VUE_APP_SOCKET_ENDPOINT + '/register', {username: this.username, email: this.email, password: this.password}, { withCredentials: true })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      })
      .then((response) => {
        if (response) {
          if (response.status == 200) {
            window.location = currentUrl
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
