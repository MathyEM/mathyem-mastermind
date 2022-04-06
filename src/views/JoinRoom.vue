<template>
  <div class="join-room">
  </div>
</template>

<script>
// @ is an alias to /src
import { socketConnection } from '../services/socketio.service.js'

export default {
  name: 'Room',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  async created() {
  },
  beforeRouteEnter(to) {
    if (to.params && to.params.id) {
      socketConnection.joinRoom(to.params.id.trim())
    }

  },
}
</script>

<style lang="scss">
.game {
  display: grid;
  grid-template-rows: auto auto auto auto 1fr auto;
  height: 100%;
}
</style>