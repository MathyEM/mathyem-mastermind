const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  checkEntryCompletion({ state }, entry) {  // check if an attempt or solution entry is complete (i.e. does not require more code pieces)
    state
    if (!entry.includes('')) {
      return true
    }
    return false
  },
  async getAccuracyHint({ state }, payload) {
    state
    const { solution, attempt } = payload
    let solutionCopy = solution.slice()
    let correctPieceCount = 0
    let correctPositionCount = 0
  
    for (let index = 0; index < attempt.length; index++) {
      const piece = attempt[index]
      const indexOfAttemptPiece = solutionCopy.indexOf(piece)
  
      if (indexOfAttemptPiece > -1) {	// if the solutions includes the attemptPiece then count it as a correct piece and remove it from the copy
        correctPieceCount++
        solutionCopy.splice(indexOfAttemptPiece, 1)
      }
  
      if (piece === solution[index]) { // if the code piece is the same for both attempt and solution at the same index
        correctPositionCount++
      }
    }
    
    return { correctPieceCount, correctPositionCount }
  },
  getRandomInt({ state }, max) {
    state
    return Math.floor((Math.random() * max) + 1).toString();
  },
}

export default {
    state,
    getters,
    mutations,
    actions
}
