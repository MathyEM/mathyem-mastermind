const state = {
  currentStep: 0,
  tutorialSteps: [
    { //0
      disableButtons: false,
      header: 'Welcome to Mastermind',
      body: "This tutorial will guide you through the rules of Mastermind.",
      position: "center",
      highlight: null,
    },
    { //1
      disableButtons: false,
      header: 'Welcome to Mastermind',
      body: `Mastermind has two players, the <span class="bold">Mastermind</span> and the <span class="bold">Code Breaker</span>. \n \n The two players will take turns playing as <span class="bold">Mastermind</span> and <span class="bold">Code Breaker</span>. \n \n \n <span class="small-text">(in single player modes like this tutorial, you will always act as the <span class="bold">Code Breaker</span>)</span>`,
      position: "center",
      highlight: null,
    },
    { //2
      disableButtons: true,
      header: 'The Mastermind',
      body: `Using the buttons at the bottom of the screen, the <span class="bold">Mastermind</span> has to create a code for the <span class="bold">Code Breaker</span> to solve.`,
      position: "center",
      highlight: "buttons",
    },
    { //3
      disableButtons: false,
      header: 'The Mastermind',
      body: `If you are the <span class="bold">Mastermind</span> the code will be visible here while you are making it.`,
      position: "center",
      highlight: "code",
    },
    { //4
      disableButtons: false,
      header: 'The Code Breaker',
      body: `Your goal as the <span class="bold">Code Breaker</span> is to deduce the <span class="bold">Mastermind's</span> code in as few attempts as possible.`,
      position: "center",
      highlight: null,
    },
    { //5
      disableButtons: false,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
      showSolution: false,
    },
    { //6
      disableButtons: false,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
      showSolution: true,
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
