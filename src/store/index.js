import Vue from 'vue'
import Vuex from 'vuex'
import attempts from './modules/attempts'
import codeButtons from './modules/codeButtons'
import options from './modules/options'
import solution from './modules/solution'
import { socketConnection } from '@/services/socketio.service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    registeringState: false,
    user: {
      username: '',
      email: '',
    },
    loginStatus: false,
    showRoomList: false,
    usersRooms: [],
    currentRoom: {
      id: '',
      name: '',
    },
    gameData: {
      solution: ['','','',''],
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
    getRegisteringState: state => state.registeringState,
    getUsername: state => state.user.username,
    getLoginStatus: state => state.loginStatus,
    getShowRoomList: state => state.showRoomList,
    getEmail: state => state.user.email,
    getUsersRooms: state => state.usersRooms,
    getCurrentRoom: state => state.currentRoom,
    getGameData: state => state.gameData,
  },
  mutations: {
    TOGGLE_REGISTERING_STATE(state) {
      state.registeringState = !state.registeringState
    },
    SET_USER(state, payload) {
      state.user = {
        username: payload.username,
        email: payload.email,
      }
    },
    SET_LOGIN_STATUS(state, payload) {
      state.loginStatus = payload
    },
    SET_SHOW_ROOM_LIST(state, payload) {
      state.showRoomList = payload
    },
    SET_USERS_ROOMS(state, payload) {
      state.usersRooms = payload
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
      socketConnection.disconnect()
      socketConnection.setupSocketConnection()
      dispatch('updateLoginStatus', true)
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
        socketConnection.getGameData(userData)
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
