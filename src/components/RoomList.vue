<template>
  <transition name="slide-fade">
    <div v-if="getShowRoomList" class="room-list" v-click-outside="toggleMenus">
      <div class="room-list-headers">
        <p>Opponent</p>
        <p>Room name</p>
      </div>
      <div v-if="getUsersRooms.length > 0" class="rooms">
        <div
          class="room"
          v-for="room in getUsersRooms"
          :key="room._id"
          @click="changeRoom(room._id)"
          :class="{ active: (room._id === getCurrentRoom._id), 'your-turn': (isYourTurn(room) == true) }">
          <MarqueeText :duration="getDuration(getSecondPlayer(room))" :repeat="1" class="opponent">{{ getSecondPlayer(room) }}</MarqueeText>
          <MarqueeText :duration="getDuration(room.name)" :repeat="1" class="room-name">{{ room.name }}</MarqueeText>
        </div>
      </div>
      <div v-else class="rooms loading">
        <img :src="loading" alt="repeating loading gif">
      </div>
      <div class="room-list-footer">
        <div class="back-btn" @click="backToHome($route.name)">
          <img :src="backBtn" alt="back-icon icon">
          <p>Back to create/join room</p>
        </div>
      </div>
      <!-- <div> Icons made by <a href="https://www.flaticon.com/authors/fuzzee" title="Fuzzee"> Fuzzee </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div> -->
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MarqueeText from 'vue-marquee-text-component/src/components/MarqueeText.vue'

export default {
  name: 'RoomList',
	components: {
    MarqueeText,
	},
  props: {
    
  },
	data() {
		return {
      backBtn: require('@/assets/left-arrow.png'),
      loading: require('@/assets/Spinner-1s-357px.svg'),
		}
	},
	computed: {
    ...mapGetters(['getUsersRooms', 'getShowRoomList', 'getUserId', 'getCurrentRoom']),
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST', 'SET_SHOW_OPTIONS', 'SET_SESSION_LOADING']),
    ...mapActions(['enterRoom', 'backToHome', 'setShowRoomList']),
    toggleMenus() {
      this.setShowRoomList()
      this.SET_SHOW_OPTIONS(false)
    },
    isYourTurn: function(room) {
      // if you are the code MAKER and a solution is not set, it's your turn
      if (this.getUserId === room.currentCodeMaker && !room.solution[0]) {
        return true
      }
      // if you are the code BREAKER and the solution is set, it's your turn
      if (this.getUserId !== room.currentCodeMaker && room.solution[0]) {
        return true
      }
      return false
    },
    getDuration(text) {
      if (text.length > 16) {
        return 6
      }
      return 0
    },
    changeRoom(roomId) {
      this.$router.push({ name: 'room', params: { id: roomId } })
    },
    getSecondPlayer(room) {
      const userId = this.getUserId

      const secondUser = room.users.find((user, userIndex) => {
        userIndex
        return user._id._id !== userId
      })

      if (secondUser) {
        const username = secondUser._id.username
        return username
      }

      return ''
    }
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
$margin-top: 2.7rem;
$dark-gray: #505050;

.room-list {
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  font-size: 1rem;
  z-index: 4;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  min-height: 10vh;
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 70vh;
  margin-top: $margin-top;
  background: $dark-gray;
  color: whitesmoke;
  
  .rooms {
    overflow-y: auto;
    padding: 1px;

    &.loading {
      width: 100%;

      img {
        width: 50%;
      }
    }

    &::-webkit-scrollbar{
      width: 6px;
      height: 13px;
      background: $dark-gray;
    }
    &::-webkit-scrollbar-thumb{
      background: #B3AFB3;
      border-radius: 9px;
    }
    &::-webkit-scrollbar-thumb:hover{
      background: #B3AFB3;
    }
    &::-webkit-scrollbar-track{
      background: transparent;
      border-radius: 9px;
      box-shadow: inset 0px 0px 0px 0px #F0F0F0;
    }
  }

  .room-list-headers, .room {
    display: grid;
    grid-template-columns: 50% 50%;
    user-select: none;
  }

  .room-list-headers p {
    font-size: 1.2em;
    margin: 0.25rem;
    text-decoration: underline;
  }

   .room {
    margin: 0;
    position: relative;
    font-size: 1.05em;
    cursor: pointer;

    &:nth-child(even) {
      .marquee-text-text {
        background: lighten($dark-gray, 2);
      }
    }

    .opponent, .room-name {
      margin: 0;
      padding: 0.6em 0.5em;
      border-bottom: 1px solid darken($dark-gray, 7);
    }

    .opponent {
      border-right: 1px solid gray;
    }

    .room-name {
      position: relative;
      margin-left: 0;

      &::before {
        content: '';
        position: absolute;
        width: 0.3em;
        height: 95%;
        background: $dark-gray;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        z-index: 1;
      }
    }

    &.active, &.active .room-name::before {
      background: lighten($dark-gray, 8);
    }

    &::after {
      content: '';
      position: absolute;
      width: 0.4rem;
      height: 80%;
      background: $orange;
      top: 49%;
      right: 0;
      transform: translateY(-50%);
      z-index: 1;
    }

    &.your-turn::after {
      background: $green;
    }
  }

  .room:hover, .back-btn:hover, .room:hover .room-name::before {
    background: lighten($dark-gray, 12);
  }

  .room-list-footer {
    .back-btn {
      padding: 0.5rem;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: row;
      user-select: none;
      cursor: pointer;

      p {
        margin: 0;
        font-weight: bold;
      }

      img {
        height: 1.8em;
      }
    }
  }
}
.slide-fade-enter, .slide-fade-leave-to {
  width: 0;
  opacity: 0;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.2s;
}
</style>