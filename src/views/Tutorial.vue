<template>
  <div class="tutorial game">
    <button class="test-btn" @click="test">test</button>
    <SPSolution />
    <div class="game-status-wrapper">
      <GameStatus v-if="!SPGetReviewingPreviousRound" />
      <SPNextRoundButton v-else />
    </div>
    <SPAttempts />
    <Modal :show="showModal" :position="TUTGetTutorialSteps[TUTGetCurrentStep].position">
      <template v-slot:header>{{ TUTGetTutorialSteps[TUTGetCurrentStep].header }}</template>
      <template v-slot:body>{{ TUTGetTutorialSteps[TUTGetCurrentStep].body }}</template>
      <template v-slot:footer>
        <button @click="TutDecrementCurrentStep">Back</button>
        
        <button @click="TutIncrementCurrentStep">Next</button>
        <p>Step {{ TUTGetCurrentStep + 1 }}/{{ TUTGetTutorialSteps.length }}</p>
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
      showModal: false,
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
</style>