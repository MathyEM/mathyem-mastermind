<template>
  <transition name="slide-fade">
    <div v-if="getShowOptions" class="options">
      <div class="footer">
        <div class="join-code">
          <p><span class="join-code-text">Join code:</span><br> {{ getCurrentRoom._id }}</p>
          <div class="copy-img">
            <img :src="copyImg" alt="copy-paste icon">
          </div>
        </div>
        <div class="logout-btn">
          <button>Log out</button>
        </div>
      </div>
    </div>
    <!-- <div> undefined <a href="" title="Gregor Cresnar"> Gregor Cresnar </a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com'</a></div> -->
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Options',
  data() {
    return {
      copyImg: require('@/assets/copy67x67.png')
    }
  },
  computed: {
    ...mapGetters(['getCurrentRoom', 'getShowOptions'])
	},
  methods: {
    ...mapMutations(['SET_SHOW_OPTIONS']),
  }
}
</script>

<style scoped lang="scss">
$margin-top: 2.4rem;
$dark-gray: #505050;

.options {
  z-index: 4;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  min-height: 20vh;
  overflow-y: auto;
  max-height: calc(100vh - $margin-top - 1rem);
  margin-top: $margin-top;
  background: $dark-gray;
  color: whitesmoke;
  text-align: left;

  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-bottom: 1px solid darken($dark-gray, 7);

  .footer {
    margin-top: auto;

    & > div {
      margin-top: 1rem;
    }
  }

  .join-code {
    font-size: 1rem;
    display: flex;
    justify-content: space-around;
    cursor: pointer;

    p {
      margin: 0;
    }
    .join-code-text {
      font-weight: bold;
    }
    .copy-img {
      img {
        height: 2em;
      }
    }
  }

  .logout-btn {
    button {
      margin: 0;
      padding: 0.6rem;
      width: 100%;
      height: 100%;
      font-size: 1.4rem;
      border: 0;
      color: inherit;
      background: rgba($color: #fff, $alpha: 0.2);
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
