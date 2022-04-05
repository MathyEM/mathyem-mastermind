<template>
  <div class="main login-screen">
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
      loading: require('@/assets/Spinner-1s-357px.svg'),
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

</style>