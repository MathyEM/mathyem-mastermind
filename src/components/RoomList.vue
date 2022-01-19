<template>
  <transition name="slide-fade">
    <div v-if="getShowRoomList" class="room-list">
      <div class="room" v-for="room in getUsersRooms" :key="room._id">
        <p>{{ room.name }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

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
    ...mapGetters(['getUsersRooms', 'getShowRoomList'])
	},
  methods: {
  },
	created() {
	}
}
</script>

<style scoped lang="scss">
$margin-top: 2.4rem;

.room-list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  overflow-y: scroll;
  max-height: calc(100vh - $margin-top);
  margin-top: $margin-top;
  background: #505050cc;
  color: whitesmoke;

  &::-webkit-scrollbar{
    width: 13px;
    height: 13px;
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