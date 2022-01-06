<template>
  <div class="login-register">
    <input v-model="username" type="text" placeholder="Username"><br/>
    <input v-model="password" type="password" placeholder="Password"><br/>
    <button @click="login">Opret Rum</button>
    <button @click="register">Tilslut Rum</button>
  </div>
</template>

<script>

export default {
  name: 'LoginRegister',
  props: {
  },
	data() {
		return {
			username: 'Mathy',
      password: 'budding1337',
		}
	},
	computed: {

  },
  methods: {
		login() {
			console.log('login clicked')
    },
    register() {
			console.log('register clicked')
    }
  }
}
</script>

<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
