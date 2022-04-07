<template>
  <div class="login-screen">
    <h2>{{ title }}</h2>
    <LoginRegister/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginRegister from '@/components/LoginRegister.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  components: {
    LoginRegister,
  },
  data() {
    return {
      title: 'Mastermind Game',
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus']),
    loginStatus () {
      return this.getLoginStatus
    },
  },
  methods: {

  },
  watch: {
    loginStatus: function (newLoginStatus) {
      console.log(newLoginStatus)
      if (newLoginStatus) {
        this.$router.push({ name: 'home' })
      }
    }
  },
  async created() {
    if (this.getLoginStatus) {
      this.$router.push({ name: 'home' })
    }
  },
}
</script>

<style lang="scss">
.login-screen {
  margin-top: 2rem;
}

.login-register {
  input, button {
    box-sizing: border-box;
    width: 100%;
    font-size: 1.1rem;
    height: 2.6rem;
    text-align: center;
  }
}
</style>