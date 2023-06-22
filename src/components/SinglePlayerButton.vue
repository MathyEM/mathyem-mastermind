<template>
  <div class="singleplayer-btn">
    <button class="btn" @click="$router.push({ name: 'singleplayer' })">Solo Game</button>
  </div>
</template>

<script>
export default {
  name: 'SinglePlayerButton',
  components: {

  },
  props: {

  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.singleplayer-btn {
  margin-top: 1rem;

  button {
    background: $green;
    color: white;
  }
}
</style>