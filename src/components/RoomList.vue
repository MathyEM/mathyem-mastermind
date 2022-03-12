<template>
  <transition name="slide-fade">
    <div v-if="getShowRoomList" class="room-list">
      <div class="room-list-headers">
        <p>Opponent</p>
        <p>Room name</p>
      </div>
      <div
        class="room"
        v-for="room in getUsersRooms"
        :key="room._id"
        @click="changeRoom(room._id)"
        :class="{ active: (room._id === getCurrentRoom._id) }">
        <MarqueeText :duration="getDuration(getSecondPlayer(room))" :repeat="1" class="opponent">{{ getSecondPlayer(room) }}</MarqueeText>
        <MarqueeText :duration="getDuration(room.name)" :repeat="1" class="room-name">{{ room.name }}</MarqueeText>
      </div>
      <div class="room-list-footer">
        <div class="back-btn" @click="backToHome">
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
		}
	},
	computed: {
    ...mapGetters(['getUsersRooms', 'getShowRoomList', 'getUserId', 'getCurrentRoom']),
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST']),
    ...mapActions(['enterRoom', 'backToHome']),
    getDuration(text) {
      if (text.length > 17) {
        return 6
      }
      return 0
    },
    changeRoom(roomId) {
      this.enterRoom(roomId)
      this.SET_SHOW_ROOM_LIST(!this.getShowRoomList) // Hide room list after selecting a room
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
$margin-top: 2.4rem;
$dark-gray: #505050;

.room-list {
  font-size: 1rem;
  z-index: 4;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 20vh;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - $margin-top - 1rem);
  margin-top: $margin-top;
  background: $dark-gray;
  color: whitesmoke;
  display: grid;

  .room-list-headers, .room {
    display: grid;
    grid-template-columns: 50% 50%;
  }

  .room-list-headers p {
    font-size: 1.1em;
    margin: 0.25rem;
    text-decoration: underline;
  }

   .room {
    margin: 0;
    cursor: pointer;

    &:nth-child(even) {
      .marquee-text-text {
        background: lighten($dark-gray, 2);
      }
    }

    &.active {
      .marquee-text-text {
        background: lighten($dark-gray, 8);
      }
    }

    .opponent, .room-name {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid darken($dark-gray, 7);
    }

    .opponent {
      border-right: 1px solid gray;
    }

    .room-name {
      margin-left: 0;
    }
  }

  .room:hover, .back-btn:hover {
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

  &::-webkit-scrollbar{
    width: 13px;
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
.slide-fade-enter, .slide-fade-leave-to {
  width: 0;
  opacity: 0;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.2s;
}
</style>