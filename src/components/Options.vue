<template>
  <transition name="slide-fade">
    <div
    v-if="getShowOptions"
    class="options"
    :class="{'in-room': (getCurrentRoom._id != undefined)}"
    v-click-outside="toggleMenus">
      <div class="footer">
        <div v-if="getCurrentRoom._id != undefined" class="join-code" @click="copyRoomId">
          <p><span class="join-code-text">Tap to copy invitation link</span></p>
          <div class="copy-img">
            <img :src="copyImg" alt="copy-paste icon">
          </div>
        </div>
        <div class="options-buttons">
          <div v-if="getCurrentRoom._id != undefined" class="leave-room">
            <button v-if="!leaveRoomClicked" class="leave-room-btn" @click="leaveRoomCheck">Leave room</button>
            <button v-if="leaveRoomClicked" class="leave-room-confirm-btn" @click="leaveRoom(getRoomId())">Confirm</button>
          </div>
          <div class="logout-btn">
            <button @click="logoutUser">Log out</button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div> undefined <a href="" title="Gregor Cresnar"> Gregor Cresnar </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div> -->
  </transition>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

export default {
  name: 'Options',
  data() {
    return {
      copyImg: require('@/assets/copy67x67.png'),
      leaveRoomClicked: false,
    }
  },
  computed: {
    ...mapState(['currentRoom']),
    ...mapGetters(['getCurrentRoom', 'getShowOptions']),
	},
  methods: {
    ...mapMutations(['SET_SHOW_OPTIONS', 'SET_SHOW_ROOM_LIST']),
    ...mapActions(['logoutUser', 'leaveRoom']),
    toggleMenus(event) {
      this.SET_SHOW_OPTIONS(!this.getShowOptions)
      this.SET_SHOW_ROOM_LIST(false)
      event.stopPropagation()
    },
    getRoomId() {
      const roomId = this.currentRoom._id
      return roomId
    },
    leaveRoomCheck() {
      this.leaveRoomClicked = true
      setTimeout(() => {
        this.leaveRoomClicked = false
      }, 5000);
    },
    copyRoomId() {
      const text = window.location.origin + '/#/join/' + this.getCurrentRoom._id
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
        return
      }
      var textArea = document.createElement("textarea");

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if the element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a
      // flash, so some of these are just precautions. However in
      // Internet Explorer the element is visible whilst the popup
      // box asking the user for permission for the web page to
      // copy to the clipboard.
      //

      // Place in the top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of the white box if rendered for any reason.
      textArea.style.background = 'transparent';


      textArea.value = text;

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }

      document.body.removeChild(textArea);
    }
  }
}
</script>

<style scoped lang="scss">
$margin-top: $menu-margin-top;
$item-margin: 0.5rem;
$color: $background-color-2dp;

.options {
  z-index: 4;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  min-height: 20vh;
  overflow-y: auto;
  max-height: 70vh;
  margin-top: $margin-top;
  background: $color;
  color: $text-color;
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid darken($color, 7);
  box-shadow: $shadow-2dp;

  .footer {
    margin-top: auto;

    & > div {
      margin-top: $item-margin;
    }
  }

  .join-code {
    font-size: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0.2rem 0;
    transition: background-color 100ms ease-in-out;
    cursor: pointer;

    &:active {
      background-color: rgba($color: #fff, $alpha: 0.2);
    }

    p {
      margin: 0;
    }
    .join-code-text {
      font-weight: bold;
    }
    .copy-img {
      display: flex;
      img {
        height: 2em;
      }
    }
  }

  .options-buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: $item-margin;
  }

  .logout-btn {
    display: flex;

    button {
      width: 50%;
    }
  }

  .leave-room, .logout-btn {
    button {
      $btn-color: $background-color-4dp;
      margin: auto;
      padding: 0.5rem;
      height: 100%;
      font-size: 0.8em;
      border: 0;
      color: inherit;
      background: $background-color-4dp;
      box-shadow: $shadow-2dp;

      &:active {
        background: $background-color-3dp;
        box-shadow: $shadow-1dp;
      }

      &.leave-room-confirm-btn {
        background: indianred;
      }
    }
  }


  &::-webkit-scrollbar{
    width: 13px;
    height: 13px;
    background: $color;
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

.options.in-room {
  .options-buttons {
    grid-template-columns: 1fr 1fr;

    button {
      width: 100%;
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
