const sharedSession = require('express-socket.io-session')

class SocketConnection {
	socket
	namespace

	constructor(namespace) {
		this.namespace = namespace
	}

	setupSocketConnection(io, session) {
		const namespace = io.of(this.namespace).use(sharedSession(session, {
			autoSave: true
		}))

		namespace.on('connection', (socket) => {
			this.socket = socket
			const uid = function(){
				return Date.now().toString(36) + Math.random().toString(36).substr(2);
			}
		
			console.log('a guest connected: ' + socket.id)
			socket.emit('connected', 'guest connection successful')
			console.log(socket.handshake.session.passport)
		
			// CREATE ROOM
			socket.on('create-room', (data, callback) => {
				const id = uid()
				console.log('Room created: ', data.roomName, id)
				socket.join(id)
				
				callback({
					status: 'ok',
					roomName: data.roomName,
					id: id,
				})
			})
		
			// JOIN ROOM
			socket.on('join-room', (data, callback) => {
				console.log('Room joined: ', data.roomId)
				socket.join(data.roomId)
				
				io.in(data.roomId).emit('room-status', 'A new user joined the room')
		
				callback({
					status: 'ok',
					roomId: data.roomId,
				})
			})
	
			socket.on('get-game-data', async (data, callback) => {
				console.log(data.username, 'is fetching game data for', data.roomId)
	
				//DB connection
				//gameData = await fetchGameData(data.username, data.roomId)
	
				const gameData = {
					solution: [1, 3, 3, 4],
					attempts: [
						[4, 3, 2, 1],
						[3, 2, 4 ,1],
						[2, 2, 1, 3],
						[4, 4, 1, 1],
						[1, 2, 3, 4]
					]
				}
				io.to(data.roomId).emit('game-data-retrieved', gameData)
	
				await callback({
					status: 'ok'
				})
			})

			//TEST CALL
			socket.on('function-call', () => {
				console.log('function called')
				this.disconnect()
			})
		
			// ON DISCONNECT
			socket.on('disconnect', () => {
				console.log('user disconnected')
			})
		})
	}

	disconnect() {
		if (this.socket) {
      this.socket.disconnect()
			return
    }
		console.log('no socket')
	}

	login(data) {
		if (this.socket) {
      this.socket.emit('login', data)
			return
    }
		console.log('no socket')
	}
}

const guestSocket = new SocketConnection('/guest')

module.exports = guestSocket