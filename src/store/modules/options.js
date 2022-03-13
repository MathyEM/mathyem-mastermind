import { socketConnection } from '@/services/socketio.service.js'

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
    leaveRoom({state}, roomId) {
        state
        socketConnection.leaveRoom(roomId)
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}