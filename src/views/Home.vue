<template>
  <div class="home">
    <h2>Welcome {{ getUsername }}!</h2>
    <CreateJoinRoom />
    <SinglePlayerButton />
    <TutorialButton />
    <PushNotification v-if="!getPushSubscription" />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateJoinRoom from '@/components/CreateJoinRoom.vue'
import SinglePlayerButton from '@/components/SinglePlayerButton.vue'
import TutorialButton from '@/components/TutorialButton.vue'
import PushNotification from '@/components/PushNotification.vue'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    CreateJoinRoom,
    SinglePlayerButton,
    TutorialButton,
    PushNotification,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getSessionLoading',
      'getUsername',
      'getPushSubscription',
      'getUserId',
    ]),
  },
  methods: {
    ...mapActions(['resetCurrentRoom', 'socketLogin'])
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
.join-create-room, .singleplayer-btn, .tutorial-btn {
  margin-inline: 2rem;

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