<template>
  <div class="push-notification">
    <button @click="pushNotificationsInitialize()">Turn on notifications</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PushNotification',
  components: {
    
  },
  props: {
  },
  data() {
    return {
      
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['pushNotificationsInitialize'])
  }
}
</script>

<style scoped lang="scss">
.push-notification {
  margin: 1rem;

  button {
    font-size: 1.1rem;
    width: 80%;
    height: 2.6rem;
  }
}
</style>
