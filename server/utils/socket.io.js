const passport = require('passport')
const roomController = require('../controllers/roomController')
const { Room } = require('../models/room')
const PushSubscription = require('../models/pushSubscription')
const webpush = require('web-push')
const { findByIdAndDelete } = require('../models/pushSubscription')

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
				socket.emit('error', { status: false, message: 'Unauthorized user', type: 'unauthorized'})
				next()
			}
		})

		namespace.on('connection', (socket) => {
			var user
			if (socket.request.user != null) {
				user = socket.request.user
			}
			
			console.log(`connected to /user: ` + socket.id)
			socket.emit('connected', {
				message: `connection to /user successful`,
				sessionID: socket.request.sessionID,
				user: user || null,
				authorization: socket.authorization,
				sessionExpiration: socket.request.session.cookie._expires,
			})
					
			// CREATE ROOM
			socket.on('create-room', async (data) => {
				if (!socket.request.user) {
					console.error('No user, cannot create room')
					socket.emit('error', { message: 'Please login to create a room' })
					return
				}
				const result = await roomController.createRoom(socket, data)
				if (!result.room) {
					socket.emit('error', result)
					return
				}
				const newRoom = result.room
				joinSocketRoom(socket, newRoom.id)
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
				joinSocketRoom(socket, data.roomId)

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
				const result = await roomController.leaveRoom(socket, data)
				if (result.status === false) {
					socket.emit('error', result)
					return
				}
				socket.emit('room-left', result)
			})

			// FETCH USER ROOMS
			socket.on('fetch-user-rooms', async (data) => {
				const rooms = await roomController.fetchUserRooms(socket)
				socket.emit('user-rooms-fetched', rooms)
			})

			socket.on('enter-room', async (data) => {
				const result = await roomController.fetchRoom(socket, data.roomId)
				if (!result.room) {
					socket.emit('error', result)
					return
				}
				const room = result.room
				joinSocketRoom(socket, data.roomId)
				socket.emit('room-entered', room)
				socket.to(data.roomId).emit('room-status', `${user.username} joined the room`)
			})
			
			// SET THE SOLUTION AND INFORM OTHER PLAYERS IN THE ROOM
			socket.on('set-solution', async (data) => {
				console.log(data)
				const { status, message, room, solution } = await roomController.setSolution(socket, data.roomId, data.solution)

				if (status !== false) {
					// find who made the new solution
					const codeMaker = socket.request.user
					const codeMakerId = codeMaker.id

					// send new the new solution to the other person in the socket room
					socket.to(data.roomId).emit('solution-set', { message, room })

					// find the user id for the person who now need to break the code
					const codeBreaker = await room.users.find(user => user._id.id !== codeMakerId)._id
					// if the room doesn't have another player - nobody has joined yet, they left etc
					if (!codeBreaker) {
						return
					}
					const codeBreakerId = codeBreaker.id

					// find the subscription info for the user
					const codeBreakerSubscription = await PushSubscription.find({ 'user': codeBreakerId })
					if (codeBreakerSubscription < 0) {
						return
					}
					const payload = JSON.stringify({
						title: `It's your turn in ${room.name}`,
						body: `${codeMaker.username} has made a code for you to solve!`,
						data: {
							roomId: room.id,
						}
					})
					codeBreakerSubscription.forEach(async (subscription) => {
						console.log('Attemping to push notification to:', subscription.user)
						await webpush.sendNotification(subscription.subscription, payload)
						.catch(async (err) => {
							console.log(err)
							if (err.statusCode === 410) {
								const subscriptionDeleted = await PushSubscription.findByIdAndDelete(subscription._id).exec()
								console.log('Subscription deleted')
								console.log(subscriptionDeleted)
							}
						})
					})
					return
				}
				socket.emit('error', { status, message })
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
						// reset the room
						await roomController.completeRound(socket, data.roomId, attemptIndex, codeBreakerWin)
						// get the new room
						const result = await roomController.fetchRoom(socket, data.roomId)

						if (!result.room) {
							socket.emit('error', result)
							return
						}
						const room = result.room
						// send the updated room to players in the socket room
						namespace.to(data.roomId).emit('room-entered', room)
					}
				}
				if (message) {
					console.log(message)
				}
			})

			socket.on('finish-round-review', async (data) => {
				await roomController.updateUserReviewingPreviousRound(data.roomId, false, data.userId)
				const result = await roomController.fetchRoom(socket, data.roomId)

				if (!result.room) {
					socket.emit('error', result)
					return
				}
				const room = result.room
				socket.emit('room-entered', room)
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

		function joinSocketRoom(socket, roomId) {
			const oldRooms = socket.rooms
			Array.from(oldRooms).forEach((room, index) => {
				if (index == 0) {
					return
				}
				socket.leave(room)
			})
			socket.join(roomId)
		}

		function disconnect() {
			if (this.socket) {
				this.socket.disconnect()
				return
			}
			console.log('no socket')
		}
	}

}

const socketConnection = new SocketConnection('/user')


module.exports = { socketConnection }