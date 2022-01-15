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
	room.solution = [] //hide solution just in case
	return room
}

exports.joinRoom = async function (socket, id) {
	const userId = socket.request.user._id
	const room = await Room.findById(id)
	console.log(userId)
	console.log(room)

	const userAlreadyJoined = room.users.find((user) => {
		console.log(user._id, userId)
		if (user._id === userId) {
			return true
		}
		return false
	})

	if (userAlreadyJoined) { //  if the user is already in the room
		return { status: false, message: 'this user is already in the room'}
	}

	if (room.users.length >= 2) {
		return { status: false, message: 'this room is full'}
	}

	room.users.push(userId)
	await room.save()

	room.solution = [] //hide solution just in case
	return { status: true, room: room}
}

exports.fetchUserRooms = async function (socket) {
	const userId = socket.request.user._id
	const rooms = await Room.find({ 'users._id': userId })

	return rooms
}