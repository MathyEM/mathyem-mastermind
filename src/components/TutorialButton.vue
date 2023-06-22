<template>
  <div class="tutorial-btn">
    <button class="btn" @click="$router.push({ name: 'tutorial' })">How to Play</button>
  </div>
</template>

<script>
export default {
  name: 'TutorialButton',
  components: {

  },
  props: {

  },
  methods: {
    
  }
}
</script>

<style lang="scss">
.tutorial-btn {
  margin-top: 1rem;

  button {
    background: $green;
    color: white;
  }
}
</style>