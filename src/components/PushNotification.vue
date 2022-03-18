<template>
  <div class="push-notification">
    <button @click="pushNotificationsInitialize">subscribe to push</button>
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
}
</style>
