const state = {
  currentStep: 0,
  tutorialSteps: [
    { //0
      disableButtons: true,
      header: 'Welcome to Mastermind',
      body: "This tutorial will guide you through the rules of Mastermind.",
      position: "center",
    },
    { //1
      disableButtons: true,
      header: 'Welcome to Mastermind',
      body: `Mastermind has two players, the <span class="bold">Mastermind</span> and the <span class="bold">Code Breaker</span>.`,
      position: "center",
      highlight: null,
    },
    { //2
      disableButtons: true,
      header: 'The Mastermind',
      body: `Your goal as the <span class="bold">Mastermind</span> is to create the code that the <span class="bold">Code Breaker</span> has to solve.`,
      position: "center",
      highlight: "buttons",
    },
    { //3
      disableButtons: true,
      header: 'The Code Breaker',
      body: `Your goal as the <span class="bold">Code Breaker</span> is to deduce the code in as few attempts as possible.`,
      position: "center",
      highlight: null,
    },
    { //4
      disableButtons: true,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
    },
    { //5
      disableButtons: true,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
    },
    { //6
      disableButtons: true,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
    }
  ],
}

const getters = {
  TUTGetTutorialSteps: state => state.tutorialSteps,
  TUTGetCurrentStep: state => state.currentStep,
}

const mutations = {
  TUT_INCREMENT_CURRENT_STEP(state) {
    state.currentStep = state.currentStep+1
  },
  TUT_DECREMENT_CURRENT_STEP(state) {
    state.currentStep = state.currentStep-1
  },
}

const actions = {
  TutIncrementCurrentStep({ commit, getters }) {
    if (getters.TUTGetCurrentStep == getters.TUTGetTutorialSteps.length - 1) {
      return
    }
    commit('TUT_INCREMENT_CURRENT_STEP')
  },
  TutDecrementCurrentStep({ commit, getters }) {
    if (!getters.TUTGetCurrentStep > 0) {
      return
    }
    commit('TUT_DECREMENT_CURRENT_STEP')
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}
