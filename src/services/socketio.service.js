import { io } from 'socket.io-client'
import store from '../store';

class SocketioService {
  socket
  namespace
  constructor(namespace) {
    this.namespace = namespace
  }

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT+this.namespace)

    this.socket.on('room-status', response => {
      console.log(response)
    })

    this.socket.on('game-data-retrieved', async response => {
      console.log('game-data-retrieved')
      await store.dispatch('setGameData', response)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  createRoom(name) {
    if (this.socket) {
      this.socket.emit('create-room', { roomName: name }, async (response) => {
        console.log(response)

        await store.dispatch('setCurrentRoom', {id: response.id, name: response.roomName})
        await store.dispatch('fetchGameData')
      })
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