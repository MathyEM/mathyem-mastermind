<template>
  <div v-if="!getLoginStatus" class="login-register">
    <form v-on:submit.prevent="onSubmit">
      <input v-model="username" type="text" placeholder="Username">
      <div v-if="getRegisteringState && $v && $v.username.$error" class="register-errors username-errors">
        <div v-if="!$v.username.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.username.regex" class="register-error" v-html="getErrors.username.regex['EN']">{{ getErrors.username.regex['EN'] }}</div>
        <div v-if="(!$v.username.minLength || !$v.username.maxLength) && $v.username.regex" class="register-error">
          {{ getErrors.username.minmaxLength['EN'] }}
        </div>
      </div>
      <input v-if="getRegisteringState" v-model="email" type="text" placeholder="Email">
      <div v-if="getRegisteringState && $v.email.$error" class="register-errors email-errors">
        <div v-if="!$v.email.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.email.email" class="register-error">{{ getErrors.email.email['EN'] }}</div>
      </div>
      <input v-model="password" type="password" placeholder="Password" minlength="6">
      <div v-if="getRegisteringState && $v.password.$error" class="register-errors password-errors">
        <div v-if="!$v.password.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.password.minLength || !$v.password.maxLength" class="register-error">
          {{ getErrors.password.minmaxLength['EN'] }}
        </div>
        <div v-if="!$v.password.regex" class="register-error" v-html="getErrors.password.regex['EN']">{{ getErrors.password.regex['EN'] }}</div>
      </div>
      <div v-if="!getRegisteringState" class="remember-me"><p>Remember me</p><input type="checkbox" name="remember-me" id="remember-me" value="yes" v-model="rememberMe"></div>
      <button v-if="!getRegisteringState" @click="login" type="submit">Login</button>
      <button v-if="!getRegisteringState" @click="TOGGLE_REGISTERING_STATE">Register new account</button>
      <button v-if="getRegisteringState" @click="register" type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
import { required, minLength, maxLength, email, helpers } from 'vuelidate/lib/validators'

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
        minLength: minLength(this.getUsernameMinLength),
        maxLength: maxLength(this.getUsernameMaxLength),
        regex: helpers.regex('regex', this.getUsernameRegex),
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(this.getPasswordMinLength),
        maxLength: maxLength(this.getPasswordMaxLength),
        regex: helpers.regex('regex', this.getPasswordRegex),
      }
    }
  },
	computed: {
    ...mapGetters([
      'getLoginStatus',
      'getRegisteringState',
      'getLocalUsername',
      'getLocalEmail',
      'getLocalPassword',
      'getUsernameMinLength',
      'getUsernameMaxLength',
      'getUsernameRegex',
      'getPasswordMinLength',
      'getPasswordMaxLength',
      'getPasswordRegex',
      'getRememberMe',
      'getErrors',
    ]),
    username: {
      get() { return this.getLocalUsername },
      set(username) {
        this.$v.username.$touch()
        this.UPDATE_LOCAL_USERNAME(username)
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
    rememberMe: {
      get() { return this.getRememberMe },
      set(value) {
        this.UPDATE_REMEMBER_ME(value)
      }
    },

  },
  methods: {
    ...mapActions(['socketLogin', 'validateRegister', 'loginUser', 'registerUser']),
    ...mapMutations([
      'TOGGLE_REGISTERING_STATE',
      'UPDATE_LOCAL_USERNAME',
      'UPDATE_LOCAL_EMAIL',
      'UPDATE_LOCAL_PASSWORD',
      'UPDATE_REMEMBER_ME',
      ]),
    onSubmit() {
      return false
    },
		login() {
      this.loginUser()
    },
    register() {
      this.registerUser(this.$v.$invalid)
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
form input:not(:first-of-type), .remember-me, button {
  margin-top: 0.75rem;
}

.login-register {
  .remember-me {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;

    p {
      margin: 0;
      // width: 100%;
      font-size: 1.1rem;
    }

    input {
      width: 2.2rem;
    }
  }
}

.register-errors {
  margin-top: -1px;
  background: rgba($color: yellow, $alpha: 0.8);
  border: 1px solid darken(yellow, 15);
  border-top: none;
  font-size: 0.9rem;

  .register-error {
    padding: 0.25rem;
    
    &:first-child:not(:last-child) {
      border-bottom: 1px solid darken(yellow, 15);
      
    }
  }
  
}
</style>
