import { io } from 'socket.io-client'
import store from '../store';

class SocketioService {
  socket
  namespace
  constructor(namespace) {
    this.namespace = namespace
  }

  async setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT+this.namespace, {
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

      if (response.user && !response.authorization) {
        console.log('user is not anonymous')
        this.disconnect()
        return
      }

      if (response.user && !store.getters.getLoginStatus) {
        store.commit('SET_LOGIN_STATUS', true)
        return
      }
    })

    // ON LOGIN
    this.socket.on('login', (response) => {
      console.log(`logging in socket user: ${response.username}`)
      store.commit('SET_USER', {
        username: response.username,
        email: response.email,
      })
    })

    // ON ROOM CREATED
    this.socket.on('room-created', async (response) => {
      console.log('room created:')
      console.log(response)

      await store.dispatch('setCurrentRoom', {id: response._id, name: response.name})
      // await store.dispatch('fetchGameData')
    })

    // ON DISCONNECT
    this.socket.on('disconnect', () => {
      console.log(`disconnected from ${this.namespace}`)
    })
  }
  
  functionCall() {
    if (this.socket) {
      this.socket.emit('function-call')
    }
  }

  connect() {
    if (this.socket) {
      this.socket.emit('connection')
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  createRoom(name) {
    if (this.socket) {
      this.socket.emit('create-room', { roomName: name })
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId: roomId }, (response) => {
        console.log(response)
      })
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

const guestSocket = new SocketioService('/guest')
const userSocket = new SocketioService('/user')

export {guestSocket, userSocket}