<template>
  <div class="home">
    <h2>{{ title }}</h2>
    <h3>Welcome {{ getUsername }}!</h3>
    <CreateJoinRoom />
    <PushNotification v-if="!getPushSubscription" />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateJoinRoom from '@/components/CreateJoinRoom.vue'
import PushNotification from '@/components/PushNotification.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    CreateJoinRoom,
    PushNotification,
  },
  data() {
    return {
      title: 'Mastermind Game',
    }
  },
  computed: {
    ...mapGetters([
      'getSessionLoading',
      'getUsername',
      'getPushSubscription',
    ]),
  },
  methods: {
    ...mapActions(['resetCurrentRoom'])
  },
  async created() {
    this.resetCurrentRoom()

    window.addEventListener('focus', async () => {
      await this.socketLogin()
    })
  },
}
</script>

<style lang="scss">
.join-create-room {
  input, button {
    box-sizing: border-box;
    width: 100%;
    font-size: 1.1rem;
    height: 2.6rem;
    text-align: center;
  }
}

.game {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  height: 100%;
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