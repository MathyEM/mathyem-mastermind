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
      id: '',
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
    localSolution: ['','','',''],
  },
  getters: {
    getRegisteringState: state => state.registeringState,
    getUsername: state => state.user.username,
    getUserId: state => state.user.id,
    getLoginStatus: state => state.loginStatus,
    getShowRoomList: state => state.showRoomList,
    getEmail: state => state.user.email,
    getUsersRooms: state => state.usersRooms,
    getCurrentRoom: state => state.currentRoom,
    getCodeSet: state => state.currentRoom.codeSet,
    getSolutionState: state => state.currentRoom.solution[0],
    getLocalSolution: state => state.localSolution,
    getCurrentAttempt: state => { //
      if(state.currentRoom.attempts) {
        const attempts = state.currentRoom.attempts
        const index = attempts.filter(attempt => {
          return attempt.includes('')
        })
        return index.length-1
      }
    }
  },
  mutations: {
    TOGGLE_REGISTERING_STATE(state) {
      state.registeringState = !state.registeringState
    },
    SET_USER(state, payload) {
      state.user = {
        id: payload.id,
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
      state.currentRoom = payload
      console.log('Current room set', payload.name)
    },
    SET_GAME_DATA(state, payload) {
      state.gameData = payload
      console.log('Game Data set')
    },
    UPDATE_ATTEMPT(state, payload) {
      const index = state.currentRoom.attempts[payload.attemptIndex].indexOf('')
      const attemptsCopy = state.currentRoom.attempts.slice()
      attemptsCopy[payload.attemptIndex][index] = payload.code
      state.currentRoom.attempts = attemptsCopy
    },
    UPDATE_LOCAL_SOLUTION(state, payload) {
      const index = state.localSolution.indexOf('')
      const solutionCopy = state.localSolution.slice()
      solutionCopy[index] = payload
      state.localSolution = solutionCopy
    },
  },
  actions: {
    socketLogin({ dispatch }) {
      socketConnection.disconnect()
      socketConnection.setupSocketConnection()
      dispatch('updateLoginStatus', true)
    },
    updateLoginStatus({ commit }, payload) {
      commit('SET_LOGIN_STATUS', payload)
    },
    async setCurrentRoom({ commit }, payload) {
      commit('SET_CURRENT_ROOM', payload)
    },
    changeCurrentRoom({ commit }, payload) {
      commit('SET_CURRENT_ROOM', payload)
    },
    async enterRoom({ state }, payload) {
      state
      await socketConnection.enterRoom(payload)
      console.log('entering room')
    },
    setGameData({ commit }, payload) {
      commit('SET_GAME_DATA', payload)
    },
    updateAttempt({ commit, getters }, payload) {
      const code = getters.getCodeSet[payload].toString()
      const attemptIndex = getters.getCurrentAttempt
      commit('UPDATE_ATTEMPT', {code, attemptIndex})
    },
    updateLocalSolution({ commit, getters }, payload) {
      const code = getters.getCodeSet[payload].toString()
      console.log('code:', code)
      commit('UPDATE_LOCAL_SOLUTION', code)
    },
    sendAttempt(payload) {
      socketConnection.sendAttempt(payload.attempt) // send attempt (Array)
    },
    sendSolution(payload) {
      socketConnection.sendSolution(payload) // send solution (Array)
    }
  },
  modules: {
    attempts,
    codeButtons,
    options,
    solution
  }
})
