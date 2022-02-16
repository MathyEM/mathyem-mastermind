const state = {
    gameStatus: 'lel',
    errorMessages: [],
}

const getters = {
    getGameStatus: (state, getters, rootState, rootGetters) => {
        state; getters; rootState; rootGetters
        console.log(rootState.loginStatus)
        return rootState.loginStatus
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