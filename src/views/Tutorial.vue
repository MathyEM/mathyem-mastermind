<template>
  <div class="tutorial game">
    <div class="highlight highlight-code" :class="{ show: (TUTGetTutorialSteps[TUTGetCurrentStep].highlight == 'code') }">
      <SPSolution :code="TUTGetSolution" :showSolution="(TUTGetTutorialSteps[TUTGetCurrentStep].showSolution)" />
    </div>
    <div class="game-status-wrapper">
      <GameStatus v-if="!SPGetReviewingPreviousRound" />
      <SPNextRoundButton v-else />
    </div>
    <div class="highlight highlight-attempts" :class="{ show: (TUTGetTutorialSteps[TUTGetCurrentStep].highlight == 'attempts'), 'disable-buttons': (TUTGetTutorialSteps[TUTGetCurrentStep].disableButtons) }">
      <SPAttempts />
    </div>
    <div class="highlight highlight-buttons" :class="{ show: (TUTGetTutorialSteps[TUTGetCurrentStep].highlight == 'buttons'), 'disable-buttons': (TUTGetTutorialSteps[TUTGetCurrentStep].disableButtons) }">
      <SPCodeButtons />
    </div>
    <Modal :show="showModal" :position="TUTGetTutorialSteps[TUTGetCurrentStep].position">
      <template #header><p v-html="TUTGetTutorialSteps[TUTGetCurrentStep].header"></p> </template>
      <template #body><p v-html="TUTGetTutorialSteps[TUTGetCurrentStep].body"></p></template>
      <template #footer>
        <button v-if="TUTGetCurrentStep != 0" @click="TutDecrementCurrentStep">Back</button>
        <button v-else @click="TutDecrementCurrentStep" class="disabled" disabled>Back</button>
        <p>{{ TUTGetCurrentStep + 1 }}/{{ TUTGetTutorialSteps.length }}</p>
        <button v-if="TUTGetCurrentStep != TUTGetTutorialSteps.length-1" @click="TutIncrementCurrentStep">Next</button>
        <button v-else @click="finishTutorial">Finish</button>
      </template>
    </Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import SPSolution from '@/components/singleplayer/SPSolution.vue'
import GameStatus from '@/components/GameStatus.vue'
import SPNextRoundButton from '@/components/singleplayer/subcomponents/SPNextRoundButton'
import Modal from '@/components/Modal.vue'
import SPAttempts from '@/components/singleplayer/SPAttempts.vue'
import SPCodeButtons from '@/components/singleplayer/SPCodeButtons.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Tutorial',
  components: {
    SPSolution,
    GameStatus,
    SPNextRoundButton,
    SPAttempts,
    SPCodeButtons,
    Modal,
  },
  data() {
    return {
      showModal: true,
    }
  },
  computed: {
    ...mapGetters([
      'SPGetCurrentRoom',
      'SPGetReviewingPreviousRound',
      'TUTGetTutorialSteps',
      'TUTGetCurrentStep',
      'TUTGetSolution'
    ]),
  },
  watch: {
    TUTGetCurrentStep(nextStep) {
      if (this.TUTGetTutorialSteps[nextStep].insertAttempt && this.SPGetCurrentRoom.attempts[9][0] == "") {
        this.TutInsertAttempt()
      }
    }
  },
  methods: {
    ...mapActions([
      'InitializeSinglePlayerGame',
      'TutIncrementCurrentStep',
      'TutDecrementCurrentStep',
      'TutInsertAttempt',
      'TutResetTutorial',
    ]),
    finishTutorial() {
      this.$router.push({ name: 'home' })
      this.TutResetTutorial()
    }
  },
  async created() {
    this.InitializeSinglePlayerGame(this.TUTGetSolution)
  },
}
</script>

<style lang="scss">
.tutorial.game {
  display: grid;
  grid-template-rows: auto min-content auto auto;
  margin-top: 2rem;
  height: 100%;
}

.test-btn {
  max-width: 2rem;
  margin: 0 auto 0.5rem auto;
}

.highlight-code.show {
  z-index: 9999;
  margin: 0 1rem;
  box-sizing: initial;
  justify-self: center;
  padding: $code-piece-column-gap;
  margin-top: $code-piece-column-gap*-1;
  margin-bottom: $code-piece-column-gap*-1;
  width: calc(( $code-piece-size * 4 ) + ( $code-piece-column-gap * 3 )); 
  height: $code-piece-size;
  background: rgb(255 255 255 / 5%);
  border-radius: 0.4rem;
}

.highlight-attempts.show {
  z-index: 9999;
  margin: 0 1rem;
  box-sizing: initial;
  justify-self: center;
  padding: $code-piece-column-gap;
  margin-top: $code-piece-column-gap*-1;
  margin-bottom: $code-piece-column-gap*-1;
  width: calc(( $code-piece-size * 4 ) + ( $code-piece-column-gap * 3 )); 
  height: calc(($code-piece-size * 10) + ( $code-piece-row-gap * 9 ));
  background: rgb(255 255 255 / 5%);
  border-radius: 0.4rem;
}

.highlight-buttons.show {
  z-index: 9999;
  margin: 0 1rem;
  box-sizing: initial;
  justify-self: center;
  padding: $code-piece-column-gap;
  margin-top: $code-piece-column-gap*-1;
  margin-bottom: $code-piece-column-gap*-1;
  @include code-piece-scaling(1.3);
  width: calc(( $code-piece-size * (4 * 1.3) ) + ( $code-piece-column-gap * 3 )); 
  background: rgb(255 255 255 / 5%);
  border-radius: 0.4rem;
}

.disable-buttons {
  pointer-events: none;
}

.small-text {
  font-size: 0.8em;
}

.bold {
  font-weight: bold;
}

.orange {
  color: $orange;
}

.green {
  color: $green;
}
</style>