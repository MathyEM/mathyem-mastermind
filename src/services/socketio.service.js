import { io } from 'socket.io-client'
import store from '../store';

class SocketioService {
  socket
  namespace
  constructor() {

  }

  async setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT+'/user', {
      withCredentials: true,
    })

    this.socket.on('room-status', response => {
      console.log(response)
    })

    this.socket.on('game-data-retrieved', async response => {
      console.log('game-data-retrieved')
      await store.dispatch('setGameData', response)
    })

    // ON CONNECTED
    this.socket.on('connected', async response => {
      console.log(response.message)
      console.log('authorization:', response.authorization);

      if (response.authorization) {
        this.socket.emit('req-login', { message: 'attempting login' })
      }
    })
    
    // ON ERROR
    this.socket.on('error', (response) => {
      console.log(response.message)
    })

    // ON LOGIN
    this.socket.on('login', (response) => {
      console.log(`logging in socket user: ${response.username}`)
      console.log(response)

      this.fetchUserRooms()

      store.commit('SET_USER', {
        id: response._id,
        username: response.username,
        email: response.email,
      })
      store.commit('SET_LOGIN_STATUS', true)
    })

    this.socket.on('user-rooms-fetched', async (rooms) => {
      store.commit('SET_USERS_ROOMS', rooms)
    })

    // ON ROOM CREATED
    this.socket.on('room-created', async (response) => {
      console.log('room created:')
      console.log(response)

      await store.dispatch('setCurrentRoom', response)
      this.fetchUserRooms(response._id)
    })

    this.socket.on('room-joined', async (response) => {
      console.log('room joined:')
      console.log(response)

      await store.dispatch('setCurrentRoom', response)
    })

    this.socket.on('room-entered', async (response) => {
      const room = response
      console.log(room)

      await store.dispatch('setCurrentRoom', room)
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

  login() {
    if (this.socket) {
      this.socket.emit('req-login', {message: 'attempting login'})
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
      this.socket.emit('join-room', { roomId: roomId })
    }
  }

  async enterRoom(roomId) {
    if (this.socket) {
      await this.socket.emit('enter-room', { roomId: roomId })
    }
  }

  fetchUserRooms() {
    if (this.socket) {
      console.log('fetching rooms...')
      this.socket.emit('fetch-user-rooms')
    }
  }

  async sendSolution(solution) {
    if (this.socket) {
      console.log("sending solution...")
      console.log(solution)
      const roomId = store.getters.getCurrentRoom._id
      this.socket.emit('set-solution', { roomId, solution })
    }
  }

  async sendAttempt(attempt) {
    if (this.socket) {
      console.log('sending attempt...')
      console.log(attempt)
      this.socket.emit('set-attempt')
    }
  }
}

// const guestSocket = new SocketioService('/guest')
const socketConnection = new SocketioService()

export { socketConnection}