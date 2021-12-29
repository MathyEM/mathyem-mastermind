import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

		this.socket.on('room-status', response => {
			console.log(response);
		})
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  createRoom(name) {
    if (this.socket) {
      this.socket.emit('create-room', { roomName: name }, (response) => {
        console.log(response)
      })
    }
  }

  joinRoom(id) {
    if (this.socket) {
      this.socket.emit('join-room', { roomId: id }, (response) => {
        console.log(response)
      })
    }
  }

}

export default new SocketioService();