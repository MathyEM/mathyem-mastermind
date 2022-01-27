const { Room } = require('../models/room')
const User = require('../models/user')

exports.createRoom = async function (socket, data) {
	const room = new Room()
	const ownerId = socket.request.user._id

	room.name = data.roomName
	room.owner = ownerId
	room.currentCodemaker = ownerId // set th
	room.users.push(ownerId)

	await room.save()
	room.solution = false //set to false for client - false = no solution set | true = solution is set
	return room
}

exports.joinRoom = async function (socket, id) {	
	try {
		const userId = socket.request.user.id
		const room = await Room.findById(id)
		// console.log(userId)
		// console.log(room)
	
		const userAlreadyJoined = await room.users.find((user) => {
			console.log(user.id)
			console.log(userId)
			console.log(user.id === userId)
			if (user.id === userId) {
				return true
			}
			return false
		})
	
		console.log(userAlreadyJoined)
	
		if (userAlreadyJoined) { //  if the user is already in the room
			return { status: false, message: 'You are already in this room'}
		}
	
		if (room.users.length >= 2) {
			return { status: false, message: 'This room is full'}
		}
	
		room.users.push(userId)
		await room.save()
	
		if (JSON.stringify(room.solution) === JSON.stringify(['','','',''])) {	// if the solution is not set
			room.solution = false																									// set room.solution to false to indicate this
			return { status: true, room: room}
		}

		room.solution = true
		return { status: true, room: room}

	} catch (error) {
		console.log("here's error")
		console.log(error)
		return { status: false, message: 'Invalid join code' }
	}
}

exports.fetchUserRooms = async function (socket) {
	const userId = socket.request.user._id
	const rooms = await Room.find({ 'users._id': userId }, { solution: 0 }).
	populate([
		'owner', 
		{ path: 'users._id', model: 'User' }
	])

	return rooms
}

exports.deleteRooms = async function () {
	const count = await Room.deleteMany({})
	console.log(count);
}