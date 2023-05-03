<template>
  <div class="tutorial game">
    <div class="highlight-code" :class="{ show: (TUTGetTutorialSteps[TUTGetCurrentStep].highlight == 'code') }">
      <SPSolution />
    </div>
    <div class="game-status-wrapper">
      <GameStatus v-if="!SPGetReviewingPreviousRound" />
      <SPNextRoundButton v-else />
    </div>
    <SPAttempts />
    <Modal :show="showModal" :position="TUTGetTutorialSteps[TUTGetCurrentStep].position">
      <template v-slot:header>{{ TUTGetTutorialSteps[TUTGetCurrentStep].header }}</template>
      <template v-slot:body>{{ TUTGetTutorialSteps[TUTGetCurrentStep].body }}</template>
      <template v-slot:footer>
        <button v-if="TUTGetCurrentStep != 0" @click="TutDecrementCurrentStep">Back</button>
        <button v-else @click="TutDecrementCurrentStep" class="disabled" disabled>Back</button>
        <p>{{ TUTGetCurrentStep + 1 }}/{{ TUTGetTutorialSteps.length }}</p>
        <button @click="TutIncrementCurrentStep">Next</button>
      </template>
    </Modal>
    <SPCodeButtons />
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
    ]),
  },
  methods: {
    ...mapActions([
      'InitializeSinglePlayerGame',
      'TutIncrementCurrentStep',
      'TutDecrementCurrentStep',
    ]),
    test() {
      this.showModal = true
    }
  },
  async created() {
    this.InitializeSinglePlayerGame()
  },
}
</script>

<style lang="scss">
.tutorial.game {
  display: grid;
  grid-template-rows: auto auto auto 1fr;
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
  background: rgb(255 255 255 / 3%);
  box-sizing: initial;
  border-radius: 0.4rem;
}
</style>