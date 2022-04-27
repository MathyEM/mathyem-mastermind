const state = {
  SPCurrentRoom: {},
}

const getters = {

}

const mutations = {
  SET_SP_CURRENT_ROOM: (state, payload) => state.SPCurrentRoom = payload
}

const actions = {
	exampleFunction({ commit, dispatch }, roomId) {
		socketConnection.leaveRoom(roomId)
		commit('SET_SHOW_OPTIONS', false)
		dispatch('resetCurrentRoom')
	},
  InitializeSinglePlayerGame({ commit }) {
    const defaultRoom = {}
    const accuracyHints = [{},{},{},{},{},{},{},{},{},{}]
    const attempts = [
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
      ["","","",""],
    ]
    const codeSet = ["1","2","3","4"]
    const solution = ["","","",""]
    defaultRoom.accuracyHints = accuracyHints
    defaultRoom.attempts = attempts
    defaultRoom.codeSet = codeSet
    defaultRoom.solution = solution
    defaultRoom.reviewingPreviousRound = false
    defaultRoom.previousRound.accuracyHints = accuracyHints
    defaultRoom.previousRound.attempts = attempts
    defaultRoom.previousRound.codeSet = codeSet
    defaultRoom.previousRound.solution = solution

    commit('SET_SP_CURRENT_ROOM', defaultRoom)
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}