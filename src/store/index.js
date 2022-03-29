import Vue from 'vue'
import Vuex from 'vuex'
import options from './modules/options'
import statusMessages from './modules/statusMessages'
import loginRegister from './modules/loginRegister'
import createJoinRoom from './modules/createJoinRoom'
import pushNotifcations from './modules/pushNotifcations'
import { socketConnection } from '@/services/socketio.service.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appVersion: '2.0.0',
    registeringState: false,
    sessionLoading: true,
    user: {
      id: '',
      username: '',
      email: '',
    },
    loginStatus: false,
    showRoomList: false,
    showOptions: false,
    usersRooms: [],
    currentRoom: {
      id: '',
      name: '',
    },
    localSolution: ['','','',''],
  },
  getters: {
    getAppVersion: state => state.appVersion,
    getRegisteringState: state => state.registeringState,
    getSessionLoading: state => state.sessionLoading,
    getUsername: state => state.user.username,
    getUserId: state => state.user.id,
    getReviewingPreviousRound: (state, getters) => {
      state;
      const userIndex = findUserIndexById(getters.getCurrentRoom.users, getters.getUserId)
      console.log(userIndex);
      if ('reviewingPreviousRound' in getters.getCurrentRoom.users[userIndex]) {
        return getters.getCurrentRoom.users[userIndex].reviewingPreviousRound
      }
      return null
    },
    getLoginStatus: state => state.loginStatus,
    getShowRoomList: state => state.showRoomList,
    getShowOptions: state => state.showOptions,
    getEmail: state => state.user.email,
    getUsersRooms: state => state.usersRooms,
    getCurrentRoom: state => state.currentRoom,
    getPreviousRound: state => state.currentRoom.previousRound,
    getCodeSet: state => state.currentRoom.codeSet,
    getSolutionState: state => state.currentRoom.solution[0],
    getLocalSolution: state => state.localSolution,
    getCodeMaker: state => state.currentRoom.currentCodeMaker._id,
    getRoomUsers: state => state.currentRoom.users,
    getCurrentAttempt: state => {
      if(state.currentRoom.attempts) {
        const attempts = state.currentRoom.attempts
        const index = attempts.filter(attempt => {
          return attempt.includes('')
        })
        return index.length-1
      }
    },
    getAccuracyHint: (state) => (index) => {
      return state.currentRoom.accuracyHints[index]
    },
    hasCodeMakerAuthority: (state, getters) => {
      state;
      //solution already set
      if (getters.getSolutionState === true) {
        return false
      }
      // not the code maker
      if (getters.getUserId !== getters.getCodeMaker) {
        return false
      }
      return true
    },
    hasCodeBreakerAuthority: (state, getters) => {
      state;
      // no solution
      if (getters.getSolutionState === false) {
        return false
      }
      // not the code breaker
      if (getters.getUserId === getters.getCodeMaker) {
        return false
      }
      return true
    }
  },
  mutations: {
    TOGGLE_REGISTERING_STATE(state) {
      state.registeringState = !state.registeringState
    },
    SET_SESSION_LOADING(state, payload) {
      state.sessionLoading = payload
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
    SET_SHOW_OPTIONS(state, payload) {
      state.showOptions = payload
    },
    SET_USERS_ROOMS(state, payload) {
      state.usersRooms = payload
    },
    SET_CURRENT_ROOM(state, payload) {
      state.currentRoom = payload
    },
    UPDATE_ATTEMPT(state, payload) {
      const index = state.currentRoom.attempts[payload.attemptIndex].indexOf('')
      const attemptsCopy = state.currentRoom.attempts.slice()
      attemptsCopy[payload.attemptIndex][index] = payload.code
      state.currentRoom.attempts = attemptsCopy
    },
    UPDATE_ALL_ATTEMPTS(state, payload) {
      state.currentRoom.attempts = payload
    },
    UPDATE_ALL_ACCURACY_HINTS(state, payload) {
      state.currentRoom.accuracyHints = payload
    },
    UPDATE_LOCAL_SOLUTION(state, payload) {
      const index = state.localSolution.indexOf('')
      const solutionCopy = state.localSolution.slice()
      solutionCopy[index] = payload
      state.localSolution = solutionCopy
    },
    TOGGLE_LOCAL_SOLUTION(state, payload) {
      if (payload) {
        state.localSolution = ['x', 'x', 'x', 'x']
        return
      }
      state.localSolution = ['', '', '', '']
      return
    },
    TOGGLE_SOLUTION_STATE(state, payload) {
      const solutionCopy = state.currentRoom.solution.slice()
      solutionCopy[0] = payload
      state.currentRoom.solution = solutionCopy
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
    setShowRoomList({ commit, getters }) {
      if (!getters.getShowRoomList) {
        socketConnection.fetchUserRooms()
      }
      commit('SET_SHOW_ROOM_LIST', !getters.getShowRoomList)
    },
    async setCurrentRoom({ commit, getters }, payload) {
      commit('SET_CURRENT_ROOM', payload)
      commit('TOGGLE_LOCAL_SOLUTION', getters.getSolutionState)
    },
    async enterRoom({ state }, payload) {
      state
      await socketConnection.enterRoom(payload)
    },
    updateAttempt({ commit, getters, dispatch }, payload) {
      if (!getters.hasCodeBreakerAuthority) {
        return
      }
      const code = getters.getCodeSet[payload].toString()
      const attemptIndex = getters.getCurrentAttempt
      commit('UPDATE_ATTEMPT', {code, attemptIndex})
      const attempt = getters.getCurrentRoom.attempts[attemptIndex].slice()
      if (checkEntryCompletion(attempt)) {
        dispatch('sendAttempt', attemptIndex)
      }
    },
    updateLocalSolution({ commit, getters, dispatch }, payload) {
      if (!getters.hasCodeMakerAuthority) {
        return
      }
      const code = getters.getCodeSet[payload].toString()
      commit('UPDATE_LOCAL_SOLUTION', code)
      if (checkEntryCompletion(getters.getLocalSolution)) {
        dispatch('sendSolution')
        commit('TOGGLE_SOLUTION_STATE', true)
        commit('TOGGLE_LOCAL_SOLUTION', true)
      }
    },
    sendAttempt({ getters }, payload) {
      const attemptIndex = payload
      const attempt = getters.getCurrentRoom.attempts[attemptIndex].slice()
      socketConnection.sendAttempt(attempt, attemptIndex) // send attempt (Array)
    },
    sendSolution({ getters }) {
      if (!getters.hasCodeMakerAuthority) {
        return
      }
      const solution = getters.getLocalSolution
      socketConnection.sendSolution(solution) // send solution (Array)
    },
    backToHome({ commit }) {
      commit('SET_CURRENT_ROOM', { id: '', name: ''})
      commit('SET_SHOW_ROOM_LIST', false)
    },
    finishRoundReview() {
      console.log('clicked')
      socketConnection.finishRoundReview()
    },
  },
  modules: {
    statusMessages,
    options,
    loginRegister,
    createJoinRoom,
    pushNotifcations,
  }
})

function checkEntryCompletion(entry) {  // check if an attempt or solution entry is complete (i.e. does not require more code pieces)
  if (!entry.includes('')) {
    return true
  }
  return false
}

function findUserIndexById(userList, userId) {
  return userList.findIndex(function(user){return user._id._id == userId})
}
