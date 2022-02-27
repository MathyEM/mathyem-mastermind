import Vue from 'vue'
import Vuex from 'vuex'
import options from './modules/options'
import statusMessages from './modules/statusMessages'
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
    hasCodeMakerAuthority: (state, getters) => {
      state;
      if (getters.getSolutionState === true) {
        console.log('solution already set')
        return false
      }
      if (getters.getUserId !== getters.getCodeMaker) {
        console.log('you are not the codemaker')
        return false
      }
      return true
    },
    hasCodeBreakerAuthority: (state, getters) => {
      state;
      if (getters.getSolutionState === false) {
        console.log('solution not yet set')
        return false
      }
      if (getters.getUserId === getters.getCodeMaker) {
        console.log('you are not the codebreaker')
        return false
      }
      return true
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
      console.log('attempt index', payload.attemptIndex)
      console.log('piece index', index)
      const attemptsCopy = state.currentRoom.attempts.slice()
      attemptsCopy[payload.attemptIndex][index] = payload.code
      state.currentRoom.attempts = attemptsCopy
    },
    UPDATE_ALL_ATTEMPTS(state, payload) {
      state.currentRoom.attempts = payload
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
    TOGGLE_SOLUTION_STATE(state) {
      const solutionCopy = state.currentRoom.solution.slice()
      solutionCopy[0] = !solutionCopy[0]
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
    async setCurrentRoom({ commit, getters }, payload) {
      commit('SET_CURRENT_ROOM', payload)
      console.log(getters.getSolutionState)
      commit('TOGGLE_LOCAL_SOLUTION', getters.getSolutionState)
    },
    async enterRoom({ state }, payload) {
      state
      await socketConnection.enterRoom(payload)
      console.log('entering room')
    },
    setGameData({ commit }, payload) {
      commit('SET_GAME_DATA', payload)
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
        commit('TOGGLE_SOLUTION_STATE')
        commit('TOGGLE_LOCAL_SOLUTION', getters.getSolutionState)
      }
    },
    sendAttempt({ getters }, payload) {
      const attemptIndex = payload
      const attempt = getters.getCurrentRoom.attempts[attemptIndex].slice()
      socketConnection.sendAttempt(attempt, attemptIndex) // send attempt (Array)
    },
    sendSolution({ getters }) {
      // TODO:
      // CHECK FOR CURRENTCODEMAKER BEFORE SETTING SOLUTION
      // IF CURRENTCODEMAKER !== USERID && GETSOLUTIONSTATE === FALSE THEN WRITE "WAITING FOR CODEMAKER"
      if (!getters.hasCodeMakerAuthority) {
        return
      }
      const solution = getters.getLocalSolution
      socketConnection.sendSolution(solution) // send solution (Array)
    }
  },
  modules: {
    statusMessages,
    options,
  }
})

function checkEntryCompletion(entry) {  // check if an attempt or solution entry is complete (i.e. does not require more code pieces)
  if (!entry.includes('')) {
    console.log('done')
    return true
  }
  return false
}
