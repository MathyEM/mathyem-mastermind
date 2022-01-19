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

      // if (response.user && !store.getters.getLoginStatus) {
      //   const user = response.user
      //   console.log(`logging in socket user: ${user.username}`)
      //   store.commit('SET_USER', {
      //     username: user.username,
      //     email: user.email,
      //   })
      //   return
      // }
    })
    
    // ON LOGIN
    this.socket.on('login', (response) => {
      console.log(`logging in socket user: ${response.username}`)
      console.log(response)

      this.fetchUserRooms()

      store.commit('SET_USER', {
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

      await store.dispatch('setCurrentRoom', {id: response._id, name: response.name})
      // await store.dispatch('fetchGameData')
    })

    this.socket.on('room-joined', async (response) => {
      console.log('room joined:')
      console.log(response)

      await store.dispatch('setCurrentRoom', {id: response._id, name: response.name})
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

  fetchUserRooms() {
    if (this.socket) {
      console.log('fetching rooms...')
      this.socket.emit('fetch-user-rooms')
    }
  }

  getGameData(userData) {
    if (this.socket) {
      this.socket.emit('get-game-data', userData, (response) => {
        console.log(response);
      })
    }
  }

}

// const guestSocket = new SocketioService('/guest')
const socketConnection = new SocketioService()

export { socketConnection}