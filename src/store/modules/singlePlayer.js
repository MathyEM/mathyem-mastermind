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
    const index = state.SPCurrentRoom.attempts[payload.attemptIndex].indexOf('')-1
    if (index < 0) {
      return
    }
    const attemptsCopy = state.SPCurrentRoom.attempts.slice()
    attemptsCopy[payload.attemptIndex][index] = ''
    state.SPCurrentRoom.attempts = attemptsCopy
  },
  SP_UPDATE_ATTEMPT(state, payload) {
    const index = state.SPCurrentRoom.attempts[payload.attemptIndex].indexOf('')
    const attemptsCopy = state.SPCurrentRoom.attempts.slice()
    attemptsCopy[payload.attemptIndex][index] = payload.code
    state.SPCurrentRoom.attempts = attemptsCopy
  },
  SP_SET_ACCURACY_HINT(state, payload) {
    const { accuracyHint, attemptIndex } = payload

    const accuracyHintsCopy = state.SPCurrentRoom.accuracyHints.slice()
    accuracyHintsCopy[attemptIndex] = accuracyHint
    state.SPCurrentRoom.accuracyHints = accuracyHintsCopy
  },
  SP_SET_REVIEWING_PREVIOUS_ROUND: (state, payload) => state.SPCurrentRoom.reviewingPreviousRound = payload,
}

const actions = {
  SPCreateBaseRoom() {
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
    const solution = []
    defaultRoom.accuracyHints = accuracyHints
    defaultRoom.attempts = attempts
    defaultRoom.codeSet = codeSet
    defaultRoom.solution = solution
    defaultRoom.reviewingPreviousRound = false
    return defaultRoom
  },
  async InitializeSinglePlayerGame({ commit, dispatch }) {
    const defaultRoom = await dispatch('SPCreateBaseRoom')
    defaultRoom.solution = [await dispatch('getRandomInt', 4),await dispatch('getRandomInt', 4),await dispatch('getRandomInt', 4),await dispatch('getRandomInt', 4)]
    defaultRoom.previousRound = {}
    defaultRoom.previousRound.accuracyHints = defaultRoom.accuracyHints
    defaultRoom.previousRound.attempts = defaultRoom.attempts
    defaultRoom.previousRound.codeSet = defaultRoom.codeSet
    defaultRoom.previousRound.solution = defaultRoom.solution

    commit('SP_SET_CURRENT_ROOM', defaultRoom)
  },
  async SPUpdateAttempt({ commit, getters, dispatch }, payload) {
    const solution = getters.SPGetSolution
    if (getters.SPGetReviewingPreviousRound) {
      return
    }
    const code = getters.SPGetCodeSet[payload].toString()
    const attemptIndex = getters.SPGetCurrentAttempt
    commit('SP_UPDATE_ATTEMPT', { code, attemptIndex })

    const attempt = getters.SPGetCurrentRoom.attempts[attemptIndex].slice()
    if (await dispatch('checkEntryCompletion', attempt)) {
      const accuracyHint = await dispatch('getAccuracyHint', { solution, attempt })
      commit('SP_SET_ACCURACY_HINT', { accuracyHint, attemptIndex })
      
      if (accuracyHint.correctPositionCount == 4) { // If the attempt is correct
        dispatch('SPCompleteRound')
      }

      if (attemptIndex == 0) { // when last attempt
        console.log("last attempt")
        dispatch('SPCompleteRound')
        //End round - review previous round
      }
    }
  },
  SPUndoAttemptPiece({ commit, getters }) {
    if (getters.SPGetReviewingPreviousRound) {
      return
    }
    const attemptIndex = getters.SPGetCurrentAttempt
    commit('SP_UNDO_ATTEMPT_PIECE', { attemptIndex })
  },
  async SPCompleteRound({ state, commit, dispatch }) {
    let currentRoom = {...state.SPCurrentRoom}
    delete currentRoom.previousRound
    delete currentRoom.reviewingPreviousRound

    const room = await dispatch('SPCreateBaseRoom')
    console.log(room);
    room.reviewingPreviousRound = true
    room.previousRound = currentRoom

    commit('SP_SET_CURRENT_ROOM', room)
  },
  SPFinishRoundReview({ dispatch }) {
    dispatch('InitializeSinglePlayerGame')
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}