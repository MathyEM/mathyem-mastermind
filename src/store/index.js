import Vue from 'vue'
import Vuex from 'vuex'
import attempts from './modules/attempts'
import codeButtons from './modules/codeButtons'
import options from './modules/options'
import solution from './modules/solution'
import SocketioService from '@/services/socketio.service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: 'Mathy',
    currentRoom: {
      id: '',
      name: '',
    },
    gameData: {
      solution: [],
      attempts: [],
    }
  },
  getters: {
    getUsername: state => state.username,
    getCurrentRoom: state => state.currentRoom,
    getGameData: state => state.gameData,
  },
  mutations: {
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
    async setCurrentRoom({commit}, payload) {
      commit('SET_CURRENT_ROOM', payload)
    },
    async getGameData({getters, commit}) {
      if (getters.getUsername && getters.getCurrentRoom.id ) {
        const userData = {
          username: getters.getUsername,
          roomId: getters.getCurrentRoom.id
        }
        const gameData = SocketioService.getGameData(userData)
        commit('SET_GAME_DATA', gameData)
        return
      }
      console.log('Game data could not be set')
      return
    }
  },
  modules: {
    attempts,
    codeButtons,
    options,
    solution
  }
})
