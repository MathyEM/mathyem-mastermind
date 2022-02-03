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
	const rooms = await Room.find({ 'users._id': userId }, { solution: 0, attempts: 0, codeSet: 0 }).
	populate([
		'owner', 
		{ path: 'users._id', model: 'User' }
	])

	return rooms
}

exports.fetchRoom = async function (socket, roomId) {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId }).
	populate([
		'owner', 
		{ path: 'users._id', model: 'User' }
	])
	if (JSON.stringify(room.solution) === JSON.stringify(['','','','']) || JSON.stringify(room.solution) === '[]') {	// if the solution is not set
		room.solution = false																									// set room.solution to false to indicate this
		return room
	}

	room.solution = true
	return room
}

exports.updateAttempt = async function (socket, roomId, attemptIndex, attempt) {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId }).
	populate([
		'owner', 
		{ path: 'users._id', model: 'User' }
	])

	// validate the new attempt
	const codeSetValidator = (codePiece) => {
    return room.codeSet.includes(codePiece)
	}

	// give hints according to attempt accuracy
	const getAccuracyHints = (solution, attempt) => {
		let correctPositionCount = 0
		let correctPieceCount = 0
		let foundPieces = [] // each solutionPieceIndex that has already been discovered will be pushed to this array

		attempt.forEach((attemptPiece, index) => {
			const solutionPieceIndex = solution.indexOf(attemptPiece)

			if (solutionPieceIndex === -1) {	// if this code piece does not exist in the solution
				return
			}

			if (solutionPieceIndex === index) {
				correctPositionCount++
				correctPieceCount++
				foundPieces.push(solutionPieceIndex)
				return
			}
			// IF solutionPieceIndex is not -1 (i.e. code piece does not exists)
			// AND the piece is not the same index on both side (i.e. correct position)
			// AND the specific piece index has not already been discovered
			// THEN the piece is correct
			if (solutionPieceIndex !== -1 && solutionPieceIndex !== index && !foundPieces.includes(solutionPieceIndex)) {
				correctPieceCount++
				foundPieces.push(solutionPieceIndex)
				return
			}
			
		})
	}

	if (room.solution.every(codeSetValidator)) {
		room.attempts[attemptIndex] = attempt
		await room.save()
	}

}

exports.deleteRooms = async function () {
	const count = await Room.deleteMany({})
	console.log(count);
}