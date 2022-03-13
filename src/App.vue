<template>
  <div id="app">
    <div v-if="getLoginStatus" class="menus-container">
      <RoomListButton title="Rooms" />
      <RoomList />
      <OptionsButton title="Options"/>
      <Options />
    </div>
    <router-view/>
    <div class="version">v{{ getAppVersion }}</div>
  </div>
</template>

<script>
import RoomListButton from '@/components/subcomponents/RoomListButton.vue'
import RoomList from '@/components/RoomList.vue'
import OptionsButton from '@/components/subcomponents/OptionsButton.vue'
import Options from '@/components/Options.vue'
import { socketConnection } from './services/socketio.service.js'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    RoomListButton,
    RoomList,
    OptionsButton,
    Options,
  },
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

.menus-container {
  max-width: 400px;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.4rem;
  padding-bottom: 0;
  font-size: 1.5rem;
}

.version {
  font-size: 0.7rem;
  text-align: right;
  padding-right: 0.2rem;
}
</style>
