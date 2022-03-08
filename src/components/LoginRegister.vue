<template>
  <div class="login-register">
    <form v-on:submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Username">
      <div v-if="getRegisteringState && $v.username.$error" class="register-errors username-errors">
        <div v-if="!$v.username.required" class="error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.username.alphaNum" class="error">{{ getErrors.username.alphaNum['EN'] }}</div>
        <div v-if="(!$v.username.minLength || !$v.username.maxLength) && $v.username.alphaNum" class="error">
          {{ getErrors.username.minmaxLength['EN'] }}
        </div>
      </div>
      <input v-if="getRegisteringState" v-model="email" type="text" placeholder="Email">
      <div v-if="getRegisteringState && $v.email.$error" class="register-errors email-errors">
        <div v-if="!$v.email.required" class="error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.email.email" class="error">{{ getErrors.email.email['EN'] }}</div>
      </div>
      <input v-model="password" type="password" placeholder="Password" minlength="6">
      <div v-if="getRegisteringState && $v.password.$error" class="register-errors password-errors">
        <div v-if="!$v.password.required" class="error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.password.minLength || !$v.password.maxLength" class="error">
          {{ getErrors.password.minmaxLength['EN'] }}
        </div>
      </div>
      <button v-if="!getRegisteringState" @click="login" type="submit">Login</button>
      <button v-if="!getRegisteringState" @click="TOGGLE_REGISTERING_STATE">Register new account</button>
      <button v-if="getRegisteringState" @click="register" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
import { required, minLength, maxLength, alphaNum, email } from 'vuelidate/lib/validators'

export default {
  name: 'LoginRegister',
  props: {
  },
	data() {
		return {
		}
	},
  validations() {
    return {
      username: {
        required,
        alphaNum,
        minLength: minLength(this.getUsernameMinLength),
        maxLength: maxLength(this.getUsernameMaxLength),
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(this.getPasswordMinLength),
        maxLength: maxLength(this.getPasswordMaxLength),
      }
    }
  },
	computed: {
    ...mapGetters([
      'getRegisteringState',
      'getLocalUsername',
      'getLocalEmail',
      'getLocalPassword',
      'getUsernameMinLength',
      'getUsernameMaxLength',
      'getPasswordMinLength',
      'getPasswordMaxLength',
      'getErrors',
    ]),
    username: {
      get() { return this.getLocalUsername },
      set(username) {
        this.$v.username.$touch()
        this.UPDATE_LOCAL_USERNAME(username)
        this
      }
    },
    email: {
      get() { return this.getLocalEmail },
      set(email) {
        this.$v.email.$touch()
        this.UPDATE_LOCAL_EMAIL(email)
      }
    },
    password: {
      get() { return this.getLocalPassword },
      set(password) {
        this.$v.password.$touch()
        this.UPDATE_LOCAL_PASSWORD(password)
      }
    },
  },
  methods: {
    ...mapActions(['socketLogin', 'validateRegister']),
    ...mapMutations(['TOGGLE_REGISTERING_STATE', 'UPDATE_LOCAL_USERNAME', 'UPDATE_LOCAL_EMAIL', 'UPDATE_LOCAL_PASSWORD']),
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
      if (this.$v.$invalid) {
        console.log('form invalid')
        return
      }
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
form input:not(:first-of-type), button:first-of-type {
  margin-top: 0.75rem;
}
.register-errors {
  margin-top: -1px;
  background: rgba($color: yellow, $alpha: 0.8);
  border: 1px solid darken(yellow, 15);
  border-top: none;
  font-size: 0.9rem;

  .error {
    padding: 0.25rem;
    
    &:first-child:not(:last-child) {
      border-bottom: 1px solid darken(yellow, 15);
      
    }
  }
  
}
</style>
