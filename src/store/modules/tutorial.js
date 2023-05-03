const state = {
  currentStep: 0,
  tutorialSteps: [
    {
      disableButtons: true,
      header: 'Welcome to Mastermind',
      body: "This tutorial will guide you through the rules of Mastermind.",
      position: "center",
    },
    {
      disableButtons: true,
      header: 'Welcome to Mastermind',
      body: 'Your goal as a Mastermind is to break the code your opponent has created for you',
      position: "bottom",
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
    if (!getters.TUTGetCurrentStep < getters.TUTGetTutorialSteps.length - 1) {
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
