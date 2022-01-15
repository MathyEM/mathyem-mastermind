const sharedSession = require('express-socket.io-session')
const passport = require('passport')
const { io } = require('socket.io-client')
const roomController = require('../controllers/roomController')

class SocketConnection {
	io
	socket
	
	constructor() {
	}

	setupSocketConnection(io, session) {
		this.io = io
		const namespace = io.of('/user')

		const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

		namespace.use(wrap(session))
		namespace.use(wrap(passport.initialize()))
		namespace.use(wrap(passport.session()))

		namespace.use((socket, next) => {
			if (socket.request.user) {
				console.log('authorized')
				socket.authorization = true
				next()
			} else {
				console.log('unauthorized')
				socket.authorization = false
				next()
			}
		})

		namespace.on('connection', (socket) => {
			var user
			const uid = function(){
				return Date.now().toString(36) + Math.random().toString(36).substr(2);
			}

			if (socket.request.user != null) {
				user = socket.request.user
			}
			
			console.log(`connected to /user: ` + socket.id)
			socket.emit('connected', {
				message: `connection to /user successful`,
				socketId: socket.id,
				user: user || null,
				authorization: socket.authorization
			})

			// ON LOGIN
			socket.on('req-login', (data) => {
				data
				login(socket, user)
			})
					
			// CREATE ROOM
			socket.on('create-room', async (data) => {
				const id = uid()
				console.log('Room created: ', data.roomName, id)
				socket.join(id)
				
				const newRoom = await roomController.createRoom(socket, data)
				socket.emit('room-created', newRoom)
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
			
			// GET GAME DATA
			socket.on('get-game-data', async (data, callback) => {
				console.log(data.username, 'is fetching game data for', data.roomId)
	
				//DB connection
				//gameData = await fetchGameData(data.username, data.roomId)
	
				// const gameData = {
				// 	solution: [1, 3, 3, 4],
				// 	attempts: [
				// 		[4, 3, 2, 1],
				// 		[3, 2, 4 ,1],
				// 		[2, 2, 1, 3],
				// 		[4, 4, 1, 1],
				// 		[1, 2, 3, 4]
				// 	]
				// }
				io.to(data.roomId).emit('game-data-retrieved', gameData)
	
				await callback({
					status: 'ok'
				})
			})

			//TEST CALL
			socket.on('function-call', () => {
				console.log('function called')
				disconnect()
			})
		
			// ON DISCONNECT
			socket.on('disconnect', () => {
				console.log(`user disconnected from /user`)
			})
		})

		function disconnect() {
			if (this.socket) {
				this.socket.disconnect()
				return
			}
			console.log('no socket')
		}
	
		function login(socket, user) {
			socket.emit('login', user)
		}
	}

}

const socketConnection = new SocketConnection('/user')


module.exports = { socketConnection }