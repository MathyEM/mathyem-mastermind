<template>
  <div id="app">
    <div v-if="getLoginStatus" class="menus-container" :class="{ 'is-scrolling': (getDuration(getCurrentRoom.name) > 0) }">
      <RoomListButton :title="isInRoom ? '' : 'Room'" />
      <MarqueeText v-if="isInRoom" :duration="getDuration(getCurrentRoom.name)" :repeat="1" class="room-name"><h3 class="room-name-text">{{getCurrentRoom.name}}</h3></MarqueeText>
      <OptionsButton :title="isInRoom ? '' : 'Options'"/>
    </div>
    <RoomList />
    <Options />
    <div v-if="getSessionLoading" class="loading">
      <img :src="loading" alt="repeating loading gif">
    </div>
    <router-view class="main" :class="{ 'hidden': getSessionLoading }" />
    <div class="version">v{{ getAppVersion }}</div>
  </div>
</template>

<script>
import RoomListButton from '@/components/subcomponents/RoomListButton.vue'
import RoomList from '@/components/RoomList.vue'
import OptionsButton from '@/components/subcomponents/OptionsButton.vue'
import Options from '@/components/Options.vue'
import { socketConnection } from './services/socketio.service.js'
import MarqueeText from 'vue-marquee-text-component/src/components/MarqueeText.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    RoomListButton,
    RoomList,
    OptionsButton,
    Options,
    MarqueeText,
  },
  data() {
    return {
      loading: require('@/assets/Spinner-1s-357px.svg'),
    }
  },
  computed: {
    ...mapGetters(['getLoginStatus', 'getAppVersion', 'getSWRegistration', 'getSessionLoading', 'isInRoom', 'getCurrentRoom']),
  },
  methods: {
    ...mapActions(['setRegistrationAndPushSubscription']),
    async clearNotifications() {
      const reg = await navigator.serviceWorker.getRegistration()
      if (!reg) {
        console.log('no registration detected')
        return
      }
      if (!('getNotifications' in reg)) {
        console.log('notifications not supported')
        return
      }
      const notifications = await reg.getNotifications()
      if (notifications.length > 0) {
        console.log(notifications)
        notifications.forEach(async notification => {
          await notification.close()
        })
      }
    },
    getDuration(text) {
      if (text.length > 16) {
        return 10
      }
      return 0
    },
  },
  beforeCreate() {
    // function relocate() {
    //   const { origin, href } = window.location
    //   const postOrigin = href.replace(origin, '')
    //   if (postOrigin !== '/#/') {
    //     window.location = origin + '/#/'
    //   }
    // }
    // window.addEventListener('load', relocate)
    // window.addEventListener('hashchange', relocate)
  },
  async created() {
    await this.setRegistrationAndPushSubscription()
    this.clearNotifications()
    window.addEventListener('focus', this.clearNotifications)
  },
  async beforeMount() {
    socketConnection.setupSocketConnection()
    document.querySelector('html').lang = 'en'
  },
  beforeDestroy() {
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
  position: relative;
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
  padding-bottom: 0.25rem;
  margin-bottom: 0.1rem;
  font-size: 1.5rem;
  overflow: hidden;

  .room-name {
    display: flex;
    overflow: hidden;
    padding: 0 1rem;

    & > div {
      display: flex;
      justify-content: space-around;
    }
  }
}

.menus-container.is-scrolling {
  .room-name {
  display: block;
  overflow: hidden;
  padding: 0 1rem 0 6rem;

  & > div {
    display: block;
    justify-content: unset;
  }
}
}



.room-name-text {
  margin: 0;
}

.loading {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  grid-row: span 2;

  img {
    width: 100%;
  }
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

.main {
  margin: auto;
  margin-top: 0;
  width: 100%;
  padding: 0 0.5rem 0;

  h2 {
    margin-top: 0;
  }

  &.hidden {
    display: none;
  }
}

@media only screen and (max-width: 320px) {
  .main {
    margin: auto;
    margin-top: 0;
    width: 100%;
    padding: 0 1rem;
  }
}
</style>
