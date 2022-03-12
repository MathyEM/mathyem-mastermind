<template>
  <div v-if="!attemptIndex && attemptIndex !== 0" class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index1) in code" :key="index1" ref="code-piece" @click="onClick(index1, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
  <div v-else class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index2) in getCurrentRoom.attempts[attemptIndex]" :key="index2" ref="code-piece" @click="onClick(index2, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
    <div
      class="accuracy-hints"
      :class="{ showAccuracyHint: (getAccuracyHint(attemptIndex).correctPieceCount !== undefined) }"
      v-if="getCurrentRoom.accuracyHints !== undefined && getAccuracyHint(attemptIndex).correctPieceCount !== undefined"
    >
      <div class="hint correctPosition" v-for="correctPositionCount in (getAccuracyHint(attemptIndex).correctPositionCount)" :key="'position'+correctPositionCount"></div>
      <div class="hint correctPiece" v-for="correctPieceCount in (Math.max((getAccuracyHint(attemptIndex).correctPieceCount-getAccuracyHint(attemptIndex).correctPositionCount), 0))" :key="'piece'+correctPieceCount"></div>
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
    ...mapGetters(['getCurrentRoom', 'getAccuracyHint'])
  },
  created() {
      
  }
}
</script>

<style lang="scss">
$code-piece-margin: 0.4rem;
$code-piece-size: calc(90vh / 12 - 1.5rem);
$color: #000;

.code-row {
  position: relative;
  user-select: none;
  display: flex;
  flex-wrap: nowrap;
  gap: $code-piece-margin;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  .code-piece {
    display: flex;
    justify-content: center;
    border: 1px solid $color;
    border-radius: 0.5rem;
    cursor: pointer;

    > div {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 1.2em;
      width: $code-piece-size;
      height: $code-piece-size;
    }
  }

  .accuracy-hints {
    position: absolute;
    width: $code-piece-size;
    height: $code-piece-size;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-flow: column;
    gap: 0.2rem;
    right: -25%;
    // border: 1px solid transparent;

    .hint {
      border: 1px solid black;
      border-radius: 0.1rem;

      &.correctPiece {
        background: #e3b200;
      }
      &.correctPosition {
        background: #54c300;
      }
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
