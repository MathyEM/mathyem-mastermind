<template>
  <div v-if="!attemptIndex && attemptIndex !== 0" class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index1) in code" :key="index1" ref="code-piece" @click="onClick(index1, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
  </div>
  <div v-else class="code-row" :class="{ disabled: disabled }">
    <div v-for="(piece, index2) in gameData.attempts[attemptIndex]" :key="index2" ref="code-piece" @click="onClick(index2, attemptIndex)" class="code-piece">
      <div>{{ piece }}</div>
    </div>
    <div
    class="accuracy-hints"
    :class="{ showAccuracyHint: (gameData.accuracyHints[attemptIndex].correctPieceCount !== undefined) }"
    v-if="gameData.accuracyHints !== undefined && gameData.accuracyHints[attemptIndex].correctPieceCount !== undefined">
      <div class="hint correctPosition" v-for="correctPositionCount in (gameData.accuracyHints[attemptIndex].correctPositionCount)" :key="'position'+correctPositionCount"></div>
      <div class="hint correctPiece" v-for="correctPieceCount in (Math.max((gameData.accuracyHints[attemptIndex].correctPieceCount-gameData.accuracyHints[attemptIndex].correctPositionCount), 0))" :key="'piece'+correctPieceCount"></div>
    </div>
    <div v-else-if="getCurrentAttempt == attemptIndex && !getReviewingPreviousRound && hasCodeBreakerAuthority" class="undo-attempt">
      <button @click="undoAttemptPiece">
        <img :src="undoImg" alt="Undo icon. Use to reset current attempt">
        <!-- <a href="https://www.flaticon.com/free-icons/undo" title="undo icons">Undo icons created by joalfa - Flaticon</a> -->
      </button>
    </div>
    <div v-if="getLoadingAccuracyHint === attemptIndex" class="accuracy-hints loading">
      <img :src="loading" alt="repeating loading gif">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
  data() {
    return {
      undoImg: require('@/assets/undo.png'),
      loading: require('@/assets/Spinner-1s-357px.svg'),
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentRoom',
      'getCurrentAttempt',
      'hasCodeBreakerAuthority',
      'getReviewingPreviousRound',
      'getPreviousRound',
      'getLoadingAccuracyHint'
      ]),
    gameData: {
      get: function () {
        if (this.getReviewingPreviousRound == true) {
          return this.getPreviousRound
        }
        return this.getCurrentRoom
      }
    }
  },
  methods: {
    ...mapActions(['undoAttemptPiece']),
  },
  created() {
      
  }
}
</script>

<style lang="scss">
.code-row {
  position: relative;
  user-select: none;
  display: flex;
  flex-wrap: nowrap;
  gap: $code-piece-margin;
  width: 100%;
  align-items: center;
  justify-content: center;

  .code-piece {
    display: flex;
    justify-content: center;
    // border: 1px solid $text-color-medium;
    border: none;
    border-radius: 0.4rem;
    color: $text-color;
    background: $background-color-1dp;
    box-shadow: $shadow-1dp;
    cursor: pointer;

    > div {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      font-size: 1.2em;
      @include code-piece-scaling(1);
    }
  }
  .accuracy-hints, .undo-attempt {
    position: absolute;
    right: -25%;
  }

  .undo-attempt {
    @include code-piece-scaling(1);
    display: flex;
    align-items: center;
    justify-content: flex-start;

    button {
      display: flex;
      align-items: center;
      height: 75%;
      width: 75%;
      padding: 0 0.2rem;
      border: 1px solid gray;
      border-radius: 0.2rem;

      img {
        // height: 100%;
        width: 100%;
      }
    }
  }

  .accuracy-hints {
    @include code-piece-scaling(1);
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-auto-flow: column;
    gap: 0.1rem;

    .hint {
      border: 1px solid black;
      border-radius: 0.1rem;

      &.correctPiece {
        background: $orange;
      }
      &.correctPosition {
        background: $green;
      }
    }

    &.loading {
      grid-template-columns: none;
      grid-template-rows: none;

      img {
        position: absolute;
        width: 350%;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        pointer-events: none;
      }
    }
  }

  &.active .code-piece {
    color: $text-color;
    background: $background-color-3dp;
    box-shadow: $shadow-3dp;
  }

  &.disabled {
    pointer-events: none;

    .code-piece {
      $amount: 0.7;
      color: $text-color-disabled;
      border-color: $text-color-disabled;
      background: $background-color-1dp;
      box-shadow: $shadow-1dp;
    }
  }

  @media screen and (max-width: 375px) {
    .code-piece {
      border-radius: 0.25rem;

      > div {
        font-size: 1em;
      }
    }
    .accuracy-hints {
      grid-template-rows: 33% 33%;
      grid-template-columns: 33% 33%;
      gap: 0.1rem;
      align-content: center;

      .hint {
        border-radius: 0.1rem;
      }
    }

  }
}
</style>
