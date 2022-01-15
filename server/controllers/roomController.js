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
	const room = Room.findById(id)

	if (room.users.length >= 2) {
		return { status: false, message: 'this room is full'}
	}

	const userAlreadyJoined = room.users.find((user) => {
		if (user.user === userId) {
			return true
		}
	})

	if (userAlreadyJoined === undefined) { //  if the user is already in the room
		return { status: false, message: 'this user is already in the room'}
	}

	room.users.push(userId)
	await room.save()

	room.solution = [] //hide solution just in case
	return { status: true, room: room}
}