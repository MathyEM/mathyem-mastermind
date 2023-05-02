const state = {
  tutorialSteps: [
    {
      disableButtons: true,
      text: `<h3>Welcome to Mastermind</h3>
<p>This tutorial will guide you through the rules of Mastermind.</p>
      `,
      position: "center",
    },
    {
      disableButtons: true,
      text: `<p>Your goal as a Mastermind is to break the code your opponent has created for you</p>`
    }
  ],
}

const getters = {
  SPGetCurrentRoom: state => state.SPCurrentRoom,
}

const mutations = {
  SP_SET_CURRENT_ROOM: (state, payload) => state.SPCurrentRoom = payload,
}

const actions = {
  SPCreateBaseRoom() {

  },
}

export default {
    state,
    getters,
    mutations,
    actions
}
