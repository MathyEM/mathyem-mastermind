<script>
export default {
  props: {
    show: Boolean,
    position: String,
  }
}
</script>

<template>
  <Transition name="modal">
    <div class="modal-parent">
      <div v-if="show" class="modal-mask">
      </div>
      <div v-if="show" class="modal-wrapper" :class="position">
        <div class="modal-container">
          <div class="modal-header">
            <h3>
              <slot name="header">default header</slot>
            </h3>
          </div>
          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              default footer
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
.modal-parent {
  position: absolute;
  width: 100vw;
  max-width: 500px;
  height: 100vh;
  top: 0;
  user-select: none;
}

.modal-mask {
  position: fixed;
  z-index: 9994;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  position: absolute;
  transform: translateY(0);
  z-index: 9999;
  
  &.top {
    top: 10%;
  }

  &.center {
  transform: translateY(-50%);
    top: 50%;
  }

  &.bottom {
    top: initial;
    bottom: 10%;

  }
}

.modal-container {
  position: relative;
  width: 90%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: $background-color;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow: auto;

  button {
    background: $background-color-2dp;
    box-shadow: $shadow-2dp;
    color: $text-color;
    padding: $code-piece-margin/1.2;

    &.disabled {
      background: darken($background-color-2dp, 2%);
      box-shadow: $shadow-inset-1dp;
      color: lighten($text-color-medium, 10%);
    }
  }

  p {
    display: inline-block;
    margin: 0 0.5rem;
  }
}

.modal-header, .modal-body, .modal-footer {
  white-space: break-spaces;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>