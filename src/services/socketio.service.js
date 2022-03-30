import { io } from 'socket.io-client'
import store from '../store'
import ConfigProvider from '@/ConfigProvider'

const socketEndpoint = ConfigProvider.value('socketEndpoint')

class SocketioService {
  socket
  namespace
  constructor() {

  }

  async setupSocketConnection() {
    this.socket = io(socketEndpoint+'/user', {
      withCredentials: true,
    })
    store.commit('SET_SESSION_LOADING', true)
    this.socket.on('room-status', response => {
      console.log('hallo hallo',response)
    })
    
    // ON CONNECTED
    this.socket.on('connected', async response => {
      store.commit('SET_SESSION_LOADING', false)
      if (response.authorization) {
        const { _id, username, email } = response.user
        store.commit('SET_USER', {
          id: _id,
          username: username,
          email: email,
        })

        store.commit('SET_LOGIN_STATUS', true)
      }
    })
    
    // ON ERROR
    this.socket.on('error', (response) => {
      console.log(response)
      if (response.type === 'alreadyInRoom') {
        store.commit('TOGGLE_ALREADY_IN_ROOM_ERROR_STATUS', true)
      }
      if (response.type === 'invalidJoinCode') {
        store.commit('TOGGLE_INVALID_JOIN_CODE_ERROR_STATUS', true)
      }
      if (response.type === 'invalidJoinCodeLength') {
        store.commit('TOGGLE_INVALID_JOIN_CODE_LENGTH_ERROR_STATUS', true)
      }
    })

    this.socket.on('user-rooms-fetched', async (rooms) => {
      store.commit('SET_USERS_ROOMS', rooms)
    })

    // ON ROOM CREATED
    this.socket.on('room-created', async (response) => {
      console.log('room created:', response)
      await store.dispatch('setCurrentRoom', response)
    })

    this.socket.on('room-joined', async (response) => {
      console.log('room joined:', response)
      await store.dispatch('setCurrentRoom', response)
      store.commit('TOGGLE_CREATE_JOIN_ROOM_ANY_ERROR', false)
    })

    this.socket.on('room-left', async () => {
      window.location.reload(true)
    })

    this.socket.on('room-entered', async (response) => {
      const room = response
      console.log('room:', room)
      await store.dispatch('setCurrentRoom', room)
      store.commit('SET_SESSION_LOADING', false)
    })

    this.socket.on('solution-set', async (response) => {
      await store.dispatch('setCurrentRoom', response.room)
      store.commit('TOGGLE_LOCAL_SOLUTION', true)
      store.commit('TOGGLE_SOLUTION_STATE', true)
    })

    this.socket.on('attempt-set', (response) => {
      store.commit('UPDATE_ALL_ATTEMPTS', response.attempts)
      store.commit('UPDATE_ALL_ACCURACY_HINTS', response.accuracyHints)
    })

    this.socket.on('accuracy-hints', (response) => {
      // console.log('on accuracy-hints')
      store.commit('UPDATE_ALL_ACCURACY_HINTS', response.accuracyHints)
    })

    // ON DISCONNECT
    this.socket.on('disconnect', () => {
      console.log(`disconnected from /user`)
    })
  }
  
  connect() {
    if (this.socket) {
      this.socket.emit('connection')
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }

  createRoom(name) {
    if (this.socket) {
      this.socket.emit('create-room', { roomName: name })
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      // if the user is already in the room
      if (store.getters.getUsersRooms.some(checkId, { roomId })) {
        store.commit('TOGGLE_ALREADY_IN_ROOM_ERROR_STATUS', true)
        return
      }

      this.socket.emit('join-room', { roomId: roomId })
    }
  }

  async leaveRoom(roomId) {
    if (this.socket) {
      await this.socket.emit('leave-room', roomId)
      console.log('leave-room emitted')
    }
  }

  async enterRoom(roomId) {
    if (this.socket) {
      await this.socket.emit('enter-room', { roomId })
    }
  }

  fetchUserRooms() {
    if (this.socket) {
      this.socket.emit('fetch-user-rooms')
    }
  }

  async sendSolution(solution) {
    if (this.socket) {
      const roomId = store.getters.getCurrentRoom._id
      this.socket.emit('set-solution', { roomId, solution })
    }
  }

  async sendAttempt(attempt, attemptIndex) {
    if (this.socket) {
      const roomId = store.getters.getCurrentRoom._id
      this.socket.emit('set-attempt', { roomId, attempt, attemptIndex })
    }
  }
  async finishRoundReview() {
    if (this.socket) {
      const roomId = store.getters.getCurrentRoom._id
      const userId = store.getters.getUserId
      this.socket.emit('finish-round-review', { roomId, userId })
    }
  }
}

function checkId(element) {
  element._id === this.roomId
}

// const guestSocket = new SocketioService('/guest')
const socketConnection = new SocketioService()

export { socketConnection}