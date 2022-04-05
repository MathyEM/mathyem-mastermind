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
    ...mapGetters(['getLoginStatus'])
  },
  methods: {

  },
  async created() {

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