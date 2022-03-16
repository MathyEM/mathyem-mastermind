const passport = require('passport')
const roomController = require('../controllers/roomController')
const { Room } = require('../models/room')

class SocketConnection {
	io
	
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
				if (!socket.request.user) {
					console.error('No user, cannot create room')
					socket.emit('error', { message: 'Please login to create a room' })
					return
				}
				const newRoom = await roomController.createRoom(socket, data)
				socket.join(newRoom._id)
				console.log('Room created')
				socket.emit('room-created', newRoom)
			})
		
			// JOIN ROOM
			socket.on('join-room', async (data) => {
				const joinRoom = await roomController.joinRoom(socket, data.roomId)
				const status = joinRoom.status || null
				const message = joinRoom.message || null
				const type = joinRoom.type || null
				const room = joinRoom.room || null

				if (!status) {
					console.log(message)
					socket.emit('error', { message: message, type: type })
					return
				}

				console.log('Room joined: ', data.roomId)
				socket.join(data.roomId)

				room
				.populate([
					'owner', 
					{ path: 'users._id', model: 'User' }
				], function(err, room) {
					console.log(room)
					io.in(data.roomId).emit('room-status', 'A new user joined the room')
					socket.emit('room-joined', room)
					return room
				})
			})

			// LEAVE ROOM
			socket.on('leave-room', async (data) => {
				const room = await roomController.leaveRoom(socket, data)
				socket.emit('room-left', room)
			})

			// FETCH USER ROOMS
			socket.on('fetch-user-rooms', async (data) => {
				const rooms = await roomController.fetchUserRooms(socket)
				socket.emit('user-rooms-fetched', rooms)
			})

			socket.on('enter-room', async (data) => {
				const room = await roomController.fetchRoom(socket, data.roomId)
				socket.join(data.roomId)
				socket.emit('room-entered', room)
				socket.to(data.roomId).emit('room-status', `${user.username} joined the room`)
			})
			
			// SET THE SOLUTION AND INFORM OTHER PLAYERS IN THE ROOM
			socket.on('set-solution', async (data) => {
				console.log(data)
				const { status, message, room, solution } = await roomController.setSolution(socket, data.roomId, data.solution)

				if (status !== false) {
					socket.to(data.roomId).emit('solution-set', { message, room })
				}
			})

			// SET AN ATTEMPT AND INFORM OTHER PLAYERS IN THE ROOM
			socket.on('set-attempt', async (data) => {
				const {
					status,
					message,
					attempts,
					attemptIndex,
					accuracyHints,
					gameOver,
					codeBreakerWin
				} = await roomController.updateAttempt(socket, data.roomId, data.attempt, data.attemptIndex)

				if (status !== false) {
					socket.to(data.roomId).emit('attempt-set', { attempts, accuracyHints, gameOver })
					socket.emit('accuracy-hints', { accuracyHints, gameOver })
					namespace.to(data.roomId).emit('game-over', gameOver)

					if (gameOver) {
						await roomController.completeRound(socket, data.roomId, attemptIndex, codeBreakerWin)
						const room = await roomController.fetchRoom(socket, data.roomId)
						namespace.to(data.roomId).emit('room-entered', room)
					}
				}
				if (message) {
					console.log(message)
				}
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