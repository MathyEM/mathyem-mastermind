import Vue from 'vue'
import Vuex from 'vuex'
import attempts from './modules/attempts'
import codeButtons from './modules/codeButtons'
import options from './modules/options'
import solution from './modules/solution'
import { guestSocket, userSocket } from '@/services/socketio.service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: '',
      email: '',
    },
    loginStatus: false,
    currentRoom: {
      id: '',
      name: '',
    },
    gameData: {
      solution: [1, 3, 3, 4],
      attempts: [
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','',''],
        ['','','','']
      ],
      codeSet: [1, 2, 3, 4]
    }
  },
  getters: {
    getUsername: state => state.user.username,
    getLoginStatus: state => state.loginStatus,
    getEmail: state => state.user.email,
    getCurrentRoom: state => state.currentRoom,
    getGameData: state => state.gameData,
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = {
        username: payload.username,
        email: payload.email,
      }
    },
    SET_LOGIN_STATUS(state, payload) {
      state.loginStatus = payload
    },
    SET_CURRENT_ROOM(state, payload) {
      state.currentRoom = {
        id: payload.id,
        name: payload.name,
      }
      console.log('Current room set', payload)
    },
    SET_GAME_DATA(state, payload) {
      state.gameData = payload
      console.log('Game Data set')
    }
  },
  actions: {
    socketLogin({dispatch}) {
      dispatch('updateLoginStatus', true)
      guestSocket.disconnect()
      userSocket.setupSocketConnection()
    },
    updateLoginStatus({commit}, payload) {
      commit('SET_LOGIN_STATUS', payload)
    },
    async setCurrentRoom({commit}, payload) {
      commit('SET_CURRENT_ROOM', payload)
    },
    fetchGameData({getters}) {
      if (getters.getUsername && getters.getCurrentRoom.id ) {
        const userData = {
          username: getters.getUsername,
          roomId: getters.getCurrentRoom.id
        }
        guestSocket.getGameData(userData)
        return
      }
      console.log('Game data could not be set')
      return
    },
    setGameData({commit}, payload) {
      commit('SET_GAME_DATA', payload)
    }
  },
  modules: {
    attempts,
    codeButtons,
    options,
    solution
  }
})
