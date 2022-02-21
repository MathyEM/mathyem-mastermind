<template>
  <div v-if="!attemptIndex" class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index) in code" :key="index" ref="code-piece" @click="onClick(index, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
  <div v-else class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index) in getCurrentRoom.attempts[attemptIndex]" :key="index" ref="code-piece" @click="onClick(index, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CodeRow',
  props: {
    code: Array,
    onClick: {
      required: true,
      type: Function
    },
    attemptIndex: Number,
    disabled: {
      default: false,
      type: Boolean,
    }
  },
  computed: {
    ...mapGetters(['getCurrentRoom'])
  }
}
</script>

<style lang="scss">
$code-piece-margin: 0.4rem;
$color: #000;

.code-row {
  user-select: none;
  display: flex;
  flex-wrap: nowrap;
  gap: $code-piece-margin;
  margin-bottom: $code-piece-margin;
  width: 100%;
  align-items: center;
  justify-content: center;

  .code-piece {
    display: flex;
    justify-content: center;
    border: 1px solid $color;
    border-radius: 0.5rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    width: 100%;

    > div {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }

  &.active .code-piece {
    border-style: dashed;
  }

  &.disabled {
    pointer-events: none;

    .code-piece {
      $amount: 0.5;
      color: transparentize($color, $amount);
      border-color: transparentize($color, $amount);
      background: lighten($color, $amount*100);
    }
  }
}
</style>
