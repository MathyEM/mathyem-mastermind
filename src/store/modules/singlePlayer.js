const state = {
  SPCurrentRoom: {},
}

const getters = {
  SPGetCurrentRoom: state => state.SPCurrentRoom,
  SPGetSolution: state => state.SPCurrentRoom.solution,
  SPGetCurrentAttempt: state => {
    if(state.SPCurrentRoom.attempts) {
      const attempts = state.SPCurrentRoom.attempts
      const index = attempts.filter(attempt => {
        return attempt.includes('')
      })
      return index.length-1
    }
  },
  SPGetReviewingPreviousRound: state => state.SPCurrentRoom.reviewingPreviousRound,
  SPGetPreviousRound: state => state.SPCurrentRoom.previousRound,
  SPGetCodeSet: state => state.SPCurrentRoom.codeSet,
}

const mutations = {
  SP_SET_CURRENT_ROOM: (state, payload) => state.SPCurrentRoom = payload,
  SP_UNDO_ATTEMPT_PIECE(state, payload) {
    const index = state.SPcurrentRoom.attempts[payload.attemptIndex].indexOf('')-1
    if (index < 0) {
      return
    }
    const attemptsCopy = state.SPcurrentRoom.attempts.slice()
    attemptsCopy[payload.attemptIndex][index] = ''
    state.SPcurrentRoom.attempts = attemptsCopy
  },
  SP_UPDATE_ATTEMPT(state, payload) {
    const index = state.SPCurrentRoom.attempts[payload.attemptIndex].indexOf('')
    const attemptsCopy = state.SPCurrentRoom.attempts.slice()
    attemptsCopy[payload.attemptIndex][index] = payload.code
    state.SPCurrentRoom.attempts = attemptsCopy
  },
}

const actions = {
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

    commit('SP_SET_CURRENT_ROOM', defaultRoom)
  },
  SPUpdateAttempt({ commit }, payload) {
    if (!getters.hasCodeBreakerAuthority) {
      return
    }
    const code = getters.getCodeSet[payload].toString()
    const attemptIndex = getters.getCurrentAttempt
    commit('UPDATE_ATTEMPT', { code, attemptIndex })
  },
  SPUndoAttemptPiece({ commit, getters }) {
    if (!getters.SPGetReviewingPreviousRound) {
      return
    }
    const attemptIndex = getters.SPGetCurrentAttempt
    commit('SP_UNDO_ATTEMPT_PIECE', { attemptIndex })
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}