<template>
  <div class="push-notifcation">
    <button @click="pushNotificationsInitialize">The push notification button</button>
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

</style>
