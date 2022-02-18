const state = {
    gameplayStatus: {
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
    getGameStatus: (state, getters, rootState, rootGetters) => {
        state; getters; rootState; rootGetters;
        console.log(rootState.loginStatus)

        // USE TO CALC IF CURRENT USER IS CODEBREAKER/MAKER OR NOT
        const getUsername = (id, exclusion) => {
            const users = rootGetters.getRoomUsers
            var user

            if (exclusion) {
                user = users.find(function(user) {
                return user._id._id !== id
                })
                return user
            }

            user = users.find(function(user) {
                return user._id._id === id
            })

            return user
        }
        getUsername
    }
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