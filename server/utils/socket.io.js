const sharedSession = require('express-socket.io-session')
const passport = require('passport')

class SocketConnection {
	socket
	namespace
	authorization

	constructor(namespace) {
		this.namespace = namespace
	}

	setupSocketConnection(io, session, authorization = false) {
		const namespace = io.of(this.namespace)
		this.authorization = authorization
		// namespace.use(sharedSession(session, {
		// 	autoSave: true
		// }))

		const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

		namespace.use(wrap(session))
		namespace.use(wrap(passport.initialize()))
		namespace.use(wrap(passport.session()))

		if (this.authorization) {
			namespace.use((socket, next) => {
				if (socket.request.user) {
					console.log('authorized')
					next()
				} else {
					console.log('unauthorized')
					next(new Error('unauthorized'))
				}
			})
		}

		namespace.on('connection', (socket) => {
			this.socket = socket
			const uid = function(){
				return Date.now().toString(36) + Math.random().toString(36).substr(2);
			}

			if (authorization) {
				const user = socket.request.user
				this.login(user)
			}
			
			console.log(`connected to ${this.namespace}: ` + socket.id)
			socket.emit('connected', {
				message: `connection to ${this.namespace} successful`,
				user: socket.request.user || null,
				authorization: this.authorization
			})
					
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

			// LOGIN
			socket.on('req-authenticate', (socket, next) => {
				console.log('test')
				passport.authenticate('local',
					(err, user, info) => {
						if (err) {
							return next(err);
						}

						if (!user) {
							return console.log(info)
						}


						console.log('user:')
						console.log(user)
						// guestSocket.login(user)
					})
			})
			
			// GET GAME DATA
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
const userSocket = new SocketConnection('/user')


module.exports = { guestSocket, userSocket}