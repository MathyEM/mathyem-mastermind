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
	leaveRoom({state}, roomId) {
		state
		socketConnection.leaveRoom(roomId)
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