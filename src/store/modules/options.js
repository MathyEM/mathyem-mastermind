import { socketConnection } from '@/services/socketio.service.js'
import axios from 'axios'
import ConfigProvider from '@/ConfigProvider'

const socketEndpoint = ConfigProvider.value('socketEndpoint')
const socketEndpointProtocol = ConfigProvider.value('socketEndpointProtocol')


const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
	leaveRoom({ commit, dispatch }, roomId) {
		socketConnection.leaveRoom(roomId)
		commit('SET_SHOW_OPTIONS', false)
		dispatch('resetCurrentRoom')
	},
	logoutUser() {
		const currentUrl = window.location.pathname
		axios.post(socketEndpointProtocol + socketEndpoint + '/logout', {}, { withCredentials: true })
		.then(() => {
			window.location = currentUrl
		}).catch((err) => {
			console.log(err)

		})
	}
}

export default {
    state,
    getters,
    mutations,
    actions
}