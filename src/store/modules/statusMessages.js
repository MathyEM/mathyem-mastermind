const state = {
    gameplayStatus: {
        awaitingPlayers: {
            DA: 'Find rum-koden i options-menuen og send den til en ven',
            EN: 'Find the room code in the options menu and send it to a friend'
        },
        awaitingCodeMaker: {
            DA: 'Din modstander laver en kode',
            EN: 'Your opponent is making a code',
        },
        awaitingCodeBreaker: {
            DA: 'Din modstander forsøger at løse din kode',
            EN: 'Your opponent is attempting to solve your code',
        },
        isCodeMaker: {
            DA: 'Du er kodeskaberen. Lav en kode, som din modstander skal løse',
            EN: "You're the code maker. Make a code for your opponent to solve",
        },
        isCodeBreaker: {
            DA: 'Du er kodeløseren. Løs koden din modstander, har lavet',
            EN: "You're the code breaker. Break the code your opponent made",
        }
    },
    errorMessages: [],
}

const getters = {
    getGameStatus: (state, rootGetters) => {
        // default
        if (rootGetters.getCurrentRoom.id === '') {
            return false
        }

        // if there is only one player in the room
        if (rootGetters.getRoomUsers.length < 2) {
            return state.gameplayStatus.awaitingPlayers
        }

        // if the solution is NOT set and you are not the codemaker:    awaitingCodeMaker
        if (!rootGetters.getSolutionState && rootGetters.getCodeMaker !== rootGetters.getUserId) {
            return state.gameplayStatus.awaitingCodeMaker
        }

        // if the solution IS set and you are the codemaker:            awaitingCodeBreaker
        if (rootGetters.getSolutionState && rootGetters.getCodeMaker === rootGetters.getUserId) {
            return state.gameplayStatus.awaitingCodeBreaker
        }

        // if the solution is NOT set and you are the codemaker:        isCodeMaker
        if (!rootGetters.getSolutionState && rootGetters.getCodeMaker === rootGetters.getUserId) {
            return state.gameplayStatus.isCodeMaker
        }

        // if the solution IS set and you are not the codemaker:        isCodeBreaker
        if (rootGetters.getSolutionState && rootGetters.getCodeMaker !== rootGetters.getUserId) {
            return state.gameplayStatus.isCodeBreaker
        }
    },
}

const mutations = {

}

const actions = {

}

export default {
    state,
    getters,
    mutations,
    actions
}