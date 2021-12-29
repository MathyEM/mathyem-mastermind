import { io } from 'socket.io-client';

class SocketioService {
  socket;
  constructor() {}

  setupSocketConnection() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);

		this.socket.on('create-status', response => {
			console.log(response);
		})
		this.socket.on('join-status', response => {
			console.log(response);
		})
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  createRoom(roomName) {
    if (this.socket) {
      this.socket.emit('create-room', roomName)
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId)
    }
  }

}

export default new SocketioService();