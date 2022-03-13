<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
    <div class="version">v{{ getAppVersion }}</div>
  </div>
</template>

<script>
import { socketConnection } from './services/socketio.service.js'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {},
  methods: {
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getAppVersion']),
  },
  async created() {
    socketConnection.setupSocketConnection()
  },
  beforeUnmount() {
    socketConnection.disconnect()
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  height: 100%;
}

body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.version {
  font-size: 0.7rem;
  text-align: right;
  padding-right: 0.2rem;
}
</style>
