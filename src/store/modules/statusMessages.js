const state = {
    gameStatus: 'lel',
    errorMessages: [],
}

const getters = {
    getGameStatus: (state, getters, rootState, rootGetters) => {
        state; getters; rootState; rootGetters;
        console.log(rootState.loginStatus)

        /*  USE TO CALC IF CURRENT USER IS CODEBREAKER/MAKER OR NOT
            getUsername(id, exclusion) {
                const users = this.getRoomUsers
                var user

                if (exclusion) {
                    user = users.find(function(user) {
                    return user._id._id !== id
                    })
                    return user
                }

                const user = users.find(function(user) {
                    return user._id._id === id
                })

                return user
            }

        */
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