<template>
  <div class="main">
    <h2>{{ title }}</h2>
    <CreateJoinRoom />
    <PushNotification v-if="!getPushSubscription" />
  </div>
</template>

<script>
// @ is an alias to /src
import CreateJoinRoom from '@/components/CreateJoinRoom.vue'
import PushNotification from '@/components/PushNotification.vue'

import { mapGetters } from 'vuex'

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
      'getPushSubscription',
    ]),
  },
  methods: {

  },
  async created() {

  },
}
</script>

<style lang="scss">
.main {
  margin: auto;
  margin-top: 0;
  width: 100%;
  padding: 0 0.5rem 0;

  &.loading {
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    grid-row: span 2;

    img {
      width: 100%;
    }
  }

  h2 {
    margin-top: 0;
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