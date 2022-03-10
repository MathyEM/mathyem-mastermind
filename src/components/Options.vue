<template>
  <transition name="slide-fade">
    <div v-if="getShowOptions" class="options">
      <div class="footer">
        <div class="join-code">
          <p><span class="join-code-text">Join code:</span><br> {{ getCurrentRoom._id }}</p>
        </div>
        <div class="logout-btn">
          <p>Log out</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Options',
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

    p {
      margin: 0;
    }
    .join-code-text {
      font-weight: bold;
    }
  }

  .logout-btn {
    p {
      margin: 0;
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
