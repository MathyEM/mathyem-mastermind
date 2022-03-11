<template>
  <transition name="slide-fade">
    <div v-if="getShowRoomList" class="room-list">
      <div
        class="room"
        v-for="room in getUsersRooms"
        :key="room._id"
        @click="changeRoom(room._id)"
        :class="{ active: (room._id === getCurrentRoom._id) }">
        <p class="second-player">{{ getSecondPlayer(room)}}</p>
        <p class="room-name">{{ room.name }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'RoomList',
	components: {
	},
  props: {
    
  },
	data() {
		return {
		}
	},
	computed: {
    ...mapGetters(['getUsersRooms', 'getShowRoomList', 'getUserId', 'getCurrentRoom'])
	},
  methods: {
    ...mapMutations(['SET_SHOW_ROOM_LIST']),
    ...mapActions(['enterRoom']),
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
        return username + ' -'
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
  z-index: 4;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 20vh;
  overflow-y: auto;
  max-height: calc(100vh - $margin-top - 1rem);
  margin-top: $margin-top;
  background: $dark-gray;
  color: whitesmoke;

  .room {
    display: flex;
    padding: 0.5rem;
    border-bottom: 1px solid darken($dark-gray, 7);
    cursor: pointer;

    &:nth-child(even) {
      background: lighten($dark-gray, 2);
    }

    &.active {
      background: lighten($dark-gray, 8);
    }

    &:hover {
      background: lighten($dark-gray, 12);
    }

    p {
      margin: 0;
    }

    .room-name {
      margin-left: 0.25rem;
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