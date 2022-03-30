<template>
  <div class="scores">
    <div class="player-score" :class="{ 'is-scrolling': (getDuration(getCurrentRoom.users[0]._id.username) > 0) }">
      <MarqueeText
      class="player-name"
      :duration="getDuration(getCurrentRoom.users[0]._id.username)"
      :repeat="1">
        {{ getCurrentRoom.users[0]._id.username }}
      </MarqueeText>
      <span class="score">{{ getCurrentRoom.users[0].points }}</span>
    </div>
    <div v-if="getCurrentRoom.users[1] !== undefined" class="player-score" :class="{ 'is-scrolling': (getDuration(getCurrentRoom.users[1]._id.username) > 0) }">
      <span class="score">{{ getCurrentRoom.users[1].points }}</span>
      <MarqueeText
      class="player-name"
      :duration="getDuration(getCurrentRoom.users[1]._id.username)"
      :repeat="1">
        {{ getCurrentRoom.users[1]._id.username }}
      </MarqueeText>
    </div>
    <div v-else class="player-score">
      <span class="score"></span>
      <h3 class="player-name"></h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MarqueeText from 'vue-marquee-text-component/src/components/MarqueeText.vue'

export default {
  name: 'Scores',
  components: {
    MarqueeText,
  },
  props: {
  },
  computed: {
    ...mapGetters(['getCurrentRoom'])
  },
  methods: {
    getDuration(text) {
      if (text.length > 11) {
        return 6
      }
      return 0
    },
  },
}
</script>

<style scoped lang="scss">
$marquee-padding: 1rem;
.scores {
  width: 100%;
  display: grid;
  margin: 0 0 1rem 0;
  grid-template-columns: 50% 50%;
  border-bottom: 1px solid black;
}
.player-score {
  $mid-padding: 0.5rem;
  display: grid;
  grid-template-columns: 75% 25%;
  width: 100%;
  margin: 0;
  padding-right: $mid-padding;
  justify-content: space-between;
  align-items: center;

  .player-name {
    display: inline-block;
    margin: 0;
    text-align: left;
    font-weight: bold;
  }

  &.is-scrolling .player-name > div {
      padding-left: $marquee-padding;
    }

  .score {
    text-align: right;
  }

  &:nth-of-type(2) {    
    border-left: 1px solid black;
    padding: 0;
    padding-left: $mid-padding;
    grid-template-columns: 25% 75%;

    .player-name {
      text-align: right;
      position: relative;
      height: 100%;

      > div {
        position: absolute;
        right: 0;

        > div {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }

    &.is-scrolling .player-name > div {
        right: -$marquee-padding;
      }

    .score {
      text-align: left;
    }
  }
}
</style>
