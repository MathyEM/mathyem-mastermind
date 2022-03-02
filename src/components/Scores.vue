<template>
  <div class="scores">
    <div class="player-score">
      <h3 class="player-name">{{ getCurrentRoom.users[0]._id.username }}</h3>
      <span class="score">{{ getCurrentRoom.users[0].points }}</span>
    </div>
    <div class="player-score">
      <span class="score">{{ getCurrentRoom.users[1].points }}</span>
      <h3 class="player-name">{{ getCurrentRoom.users[1]._id.username }}</h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Scores',
  components: {
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCurrentRoom'])
  },
  methods: {
    
  }

}
</script>

<style scoped lang="scss">
.scores {
  display: grid;
  margin: 0 0 1rem 0;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid black;
}
.player-score {
  $mid-padding: 0.5rem;
  display: flex;
  width: 100%;
  margin: 0;
  justify-content: space-between;
  padding-right: $mid-padding;

  h3 {
    display: inline-block;
    margin: 0;
  }

  &:nth-of-type(2) {    
    border-left: 1px solid black;
    padding: 0;
    padding-left: $mid-padding;
  }
}
</style>
