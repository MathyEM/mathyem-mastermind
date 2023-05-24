const state = {
  defaultSolution: ['1','1','4','2'],
  currentStep: 5,
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
      disableButtons: true,
      header: 'Scoring',
      body: `You have 10 attempts to deduce the code. Each failed attempt reduces the amount of score you receive. \n \n The fewer attempts you use when guessing the code, the more score you will receive`,
      position: "center",
      highlight: "attempts",
      showSolution: false,
    },
    { //6
      disableButtons: true,
      header: 'Hints',
      body: `To the right of your attempts you will be able to see <span class="orange bold">orange</span> and <span class="green bold">green</span> hints to help you find the correct code.`,
      position: "center",
      highlight: "attempts",
      showSolution: false,
      insertAttempt: true,
    },
    { //7
      disableButtons: true,
      header: 'Hints',
      body: `An <span class="orange bold">orange</span> hint means that one of your code pieces is used somewhere in the <span class="bold">Mastermind's</span> code, but is not currently in the correct position. \n\nA <span class="green bold">green</span> hint means that you have used a correct code piece and placed it correctly. \n\n The position of <span class="orange bold">orange</span> and <span class="green bold">green</span> hints do not indicate which of you code pieces are placed correctly, only how many of the are.`,
      position: "center",
      highlight: "attempts",
      showSolution: false,
    },
    { //8
      disableButtons: true,
      header: 'An Example',
      body: `As an example, the <span class="bold">Mastermind's</span> code is now revaled. There is currently <span class="bold">one</span> <span class="green bold">green</span> hint and <span class="bold">two</span> <span class="orange bold">orange</span> hints next to the first attempt. \n\nSince only <span class="bold">three</span> hints are showing that means one of the code pieces must be repeating. Because the solution is currently revealed, you can see that <span class="bold">1</span> is the repeating code piece.`,
      position: "center",
      highlight: "attempts",
      showSolution: true,
    },
    { //9
      disableButtons: true,
      header: 'Good Luck!',
      body: `This tutorial is over now. Click <span class="bold">'Next'</span> below to go back to the home screen`,
      position: "center",
      highlight: null,
      showSolution: true,
    }
  ],
}

const getters = {
  TUTGetTutorialSteps: state => state.tutorialSteps,
  TUTGetCurrentStep: state => state.currentStep,
  TUTGetSolution: state => state.defaultSolution,
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
  TutInsertAttempt({ dispatch }) {
    for (let i = 0; i < 4; i++) {
      dispatch('SPUpdateAttempt', i)
    }
  }
}

export default {
    state,
    getters,
    mutations,
    actions
}
