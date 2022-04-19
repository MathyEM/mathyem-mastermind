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
  margin: 3rem 2rem;

  button {
    font-size: 1.1rem;
    width: 100%;
    height: 2.6rem;
    background: $orange;
    color: $text-color;

    &:active {
      background: $orange-darkened;
      box-shadow: $shadow-1dp;
    }
  }
}
</style>
