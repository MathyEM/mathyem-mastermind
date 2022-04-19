<template>
  <div v-if="!getLoginStatus" class="login-register">
    <form v-on:submit.prevent="onSubmit">
      <input v-model="username" type="text" name="username" placeholder="Username" autocomplete="username">
      <div v-if="!getRegisteringState && getIncorrectUsernameOrPasswordState" class="login-errors">
        <div class="register-error">{{ getErrors.generic.incorrectUsernameOrPassword['EN'] }}</div>
      </div>
      <div v-if="getRegisteringState && $v && $v.username.$error" class="register-errors username-errors">
        <div v-if="!$v.username.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.username.regex" class="register-error" v-html="getErrors.username.regex['EN']">{{ getErrors.username.regex['EN'] }}</div>
        <div v-if="(!$v.username.minLength || !$v.username.maxLength) && $v.username.regex" class="register-error">
          {{ getErrors.username.minmaxLength['EN'] }}
        </div>
      </div>
      <input v-if="getRegisteringState" v-model="email" type="text" placeholder="Email" autocomplete="email">
      <div v-if="getRegisteringState && $v.email.$error" class="register-errors email-errors">
        <div v-if="!$v.email.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.email.email" class="register-error">{{ getErrors.email.email['EN'] }}</div>
      </div>
      <input v-model="password" type="password" placeholder="Password" autocomplete="current-password">
      <div v-if="getRegisteringState && $v.password.$error" class="register-errors password-errors">
        <div v-if="!$v.password.required" class="register-error">{{ getErrors.generic.required['EN'] }}</div>
        <div v-if="!$v.password.minLength || !$v.password.maxLength" class="register-error">
          {{ getErrors.password.minmaxLength['EN'] }}
        </div>
        <div v-if="!$v.password.regex" class="register-error" v-html="getErrors.password.regex['EN']">{{ getErrors.password.regex['EN'] }}</div>
      </div>
      <div v-if="!getRegisteringState" class="remember-me"><p>Remember me</p><input type="checkbox" name="remember_me" id="remember_me" value="yes" v-model="rememberMe"></div>
      <button v-if="!getRegisteringState" @click="login" type="submit" class="login-btn">Login</button>
      <button v-if="!getRegisteringState" @click="TOGGLE_REGISTERING_STATE" class="register-new-acc-btn">Register new account</button>
      <button v-if="getRegisteringState" @click="register" type="submit" class="register-btn">Register</button>
      <button v-if="getRegisteringState" @click="TOGGLE_REGISTERING_STATE" type="submit" class="back-btn">Back</button>
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
      'getIncorrectUsernameOrPasswordState',
      'getErrors',
    ]),
    username: {
      get() { return this.getLocalUsername },
      set(username) {
        this.$v.username.$touch()
        this.UPDATE_LOCAL_USERNAME(username.trim())
        if (!this.getRegisteringState) {
          this.UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE(false)
        }
      }
    },
    email: {
      get() { return this.getLocalEmail },
      set(email) {
        this.$v.email.$touch()
        this.UPDATE_LOCAL_EMAIL(email.trim())
      }
    },
    password: {
      get() { return this.getLocalPassword },
      set(password) {
        this.$v.password.$touch()
        this.UPDATE_LOCAL_PASSWORD(password.trim())
        if (!this.getRegisteringState) {
          this.UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE(false)
        }
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
      'UPDATE_INCORRECT_USERNAME_OR_PASSWORD_STATE',
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
  margin: 0 2rem;

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
      width: 2.6rem;
      margin: 0;
    }
  }

  .login-btn {
    background: $green;
    color: $text-color;

    &:active {
      background: $green-darkened;
    }
  }

  .register-new-acc-btn {
    background: $orange;
    color: $text-color;

    &:active {
      background: $orange-darkened;
    }
  }

  .register-btn {
    background: $green;
    color: $text-color;

    &:active {
      background: $green-darkened;
    }
  }

  .back-btn {
    background: $orange;
    color: $text-color;

    &:active {
      background: $orange-darkened;
    }
  }
}

.login-errors, .register-errors {
  margin-top: -1px;
	padding: 0.2rem;
  background: $orange;
  border: 1px solid darken($orange, 15);
  border-top: none;
  font-size: 0.9rem;
}
.register-error {
  padding: 0.25rem;
  
  &:first-child:not(:last-child) {
    border-bottom: 1px solid darken($orange, 15);
    
  }
}
</style>
