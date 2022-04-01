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
    async clearNotifications() {
      const reg = await this.getSWRegistration
      if (!reg) {
        return
      }
      const notifications = await reg.getNotifications()
      if (notifications.length > 0) {
        notifications.forEach(async notification => {
          await notification.close()
        })
      }
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getAppVersion', 'getSWRegistration']),
  },
  beforeCreate() {
    function relocate() {
      const { origin, href } = window.location
      const postOrigin = href.replace(origin, '')
      if (postOrigin !== '/#/') {
        window.location = origin + '/#/'
      }
    }
    window.addEventListener('load', relocate)
    window.addEventListener('hashchange', relocate)
  },
  async created() {
    window.addEventListener('focus', this.clearNotifications)
  },
  async beforeMount() {
    socketConnection.setupSocketConnection()
    document.querySelector('html').lang = 'en'
  },
  beforeDestroy() {
    console.log('test beforeDestroy')
    socketConnection.disconnect()
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  touch-action: pan-x pan-y;
}

html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
  max-width: 400px;
  margin: auto;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: min-content auto min-content;
}

.menus-container {
  width: 100%;
  margin: auto;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  padding-bottom: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  // background: lightgray;
}

.version {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  font-size: 0.7rem;
  text-align: right;
  padding-right: 0.2rem;
  padding-bottom: 0.1rem;
}
</style>
