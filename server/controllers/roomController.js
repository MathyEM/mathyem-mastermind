const { Room } = require('../models/room')
const User = require('../models/user')

exports.createRoom = async function (socket, data) {
	const room = new Room()
	const ownerId = socket.request.user._id

	if (data.roomName.length < 3) {
		return { status: false, message: 'room name must be at least 3 characters long' }
	}

	room.name = data.roomName
	room.owner = ownerId
	room.currentCodeMaker = ownerId
	room.users.push(ownerId)

	room.populate([
		'currentCodeMaker',
		{ path: 'users._id', model: 'User' }
	])

	await room.save()
	room.solution = false //set to false for client - false = no solution set | true = solution is set
	return room
}

exports.joinRoom = async function (socket, id) {	
	try {
		if (id.length !== 24) {
			return { status: false, message: 'Invalid join code length', type: 'invalidJoinCodeLength' }
		}
		const userId = socket.request.user.id
		const room = await Room.findById(id)
	
		const userAlreadyJoined = await room.users.find((user) => {
			if (user.id === userId) {
				return true
			}
			return false
		})
		
		if (userAlreadyJoined) { //  if the user is already in the room
			return { status: false, message: 'You are already in this room', type: 'alreadyInRoom' }
		}
	
		if (room.users.length >= 2) {
			return { status: false, message: 'This room is full', type: 'roomFull' }
		}
	
		room.users.push(userId)
		await room.save()
		
		// if the solution is not set
		// set room.solution to false to indicate this
		if (!isSolutionSet(room.solution)) {
			room.solution = false
			return { status: true, room: room}
		}

		room.solution = true
		return { status: true, room: room}

	} catch (error) {
		console.log("here's error")
		console.log(error)
		return { status: false, message: 'Invalid join code', type: 'invalidJoinCode' }
	}
}

exports.deleteRoom = async function (socket, roomId) {
	try {
		if (roomId.length !== 24) {
			return { status: false, message: 'Invalid room identifier', type: 'invalidRoomId' }
		}
		const deletedRoom = await Room.deleteOne({ _id: roomId })
		return deletedRoom
	} catch (error) {
		
	}
	
}

exports.leaveRoom = async function (socket, roomId) {
	try {
		if (roomId.length !== 24) {
			return { status: false, message: 'Invalid room identifier', type: 'invalidRoomId' }
		}
		const userId = socket.request.user._id
		const room = await Room.findOne({ _id: roomId, 'users._id': userId })
	
		if (!room) {
			return { status: false, message: 'Room not found', type: 'roomNotFound' }
		}

		var userIndex = room.users.findIndex(function(obj){return obj.id == userId})
		const leavingUserId = room.users[userIndex].id
		room.users.splice(userIndex, 1)

		if (room.users.length < 1) {
			room.remove()
			return
		}

		if (leavingUserId === room.owner.id.toString('hex')) {
			room.owner = room.users[0].id
		}

		await room.save()
		return room

	} catch (error) {
		console.log(error)
	}
}

exports.fetchUserRooms = async function (socket) {
	const userId = socket.request.user._id
	const rooms = await Room.find({ 'users._id': userId }, { attempts: 0, codeSet: 0 }).
	populate([
		'owner',
		{ path: 'users._id', model: 'User' }		
	])
	rooms.forEach((room) => {
		if (!isSolutionSet(room.solution)) {
			return room.solution = false
		}
		return room.solution = true
	})

	return rooms
}

exports.fetchRoom = async function (socket, roomId) {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId }).
	populate([
		'owner',
		'currentCodeMaker',
		{ path: 'users._id', model: 'User' }
	])
	if (!isSolutionSet(room.solution)) {
		room.solution = false
		return room
	}
	room.solution = true
	return room
}

exports.setSolution = async function (socket, roomId, solution) {
	const userId = socket.request.user.id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId }).
	populate([
		'currentCodeMaker',
		{ path: 'users._id', model: 'User' }
	])

	if (isSolutionSet(room.solution)) {
		return { status: false, message: 'solution already set' }
	}

	if (userId !== room.currentCodeMaker.id) {
		return { status: false, message: 'you are not the codemaker' }
	}

	if (!solution.every(codeSetValidator, room)) {
		return { status: false, message: 'solution does not match code set' }
	}

	room.solution = solution
	await room.save()
	room.solution = true
	return { status: true, room, solution }
}

exports.updateAttempt = async function (socket, roomId, attempt, attemptIndex) {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId }).
	populate([
		'owner', 
		{ path: 'users._id', model: 'User' }
	])

	if (userId === room.currentCodeMaker.id) {
		return { status: false, message: 'you are not the codebreaker' }
	}

	if (room.attemptIndex !== attemptIndex) {
		return { status: false, message: "your current attempt does not match the server's" }
	}

	// check validity of the attempt according to the codeSet
	if (!attempt.every(codeSetValidator, room)) {
		return { status: false, message: 'attempt does not match code set' }
	}
	
	room.attempts[attemptIndex] = attempt
	const accuracyHint = await getAccuracyHint(room.solution, attempt)
	room.accuracyHints[attemptIndex] = accuracyHint
	const accuracyHints = room.accuracyHints
	await room.save()

	const attempts = room.attempts

	let gameOver = false
	let codeBreakerWin = false

	if (attemptIndex === 0 || accuracyHint.correctPositionCount === 4) {
		if (accuracyHint.correctPositionCount === 4) {
			codeBreakerWin = true
		}
		gameOver = true
	}

	return { attempts, attemptIndex, accuracyHints, gameOver, codeBreakerWin }
}

exports.completeRound = async (socket, roomId, attemptIndex, codeBreakerWin) => {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId })
	const newCodeMaker = await room.users.find(user => !user._id.equals(room.currentCodeMaker._id))
	const codeBreakerIndex = await room.users.findIndex(user => !user._id.equals(room.currentCodeMaker._id))
	
	if (codeBreakerWin) {
		room.users[codeBreakerIndex].points += (attemptIndex+1)*2
	}

	if (!codeBreakerWin) {
		room.users[codeBreakerIndex].points += -1
	}
	
	room.currentCodeMaker = newCodeMaker._id
	await room.save()
	await exports.resetRoom(roomId)
}

exports.resetRoom = async (roomId) => {
	const room = await Room.findOne({ '_id': roomId })
	const attemptsDefault = Room.schema.paths.attempts.options.default
	const solutionDefault = Room.schema.paths.solution.options.default
	const accuracyHintsDefault = Room.schema.paths.accuracyHints.options.default
	
	room.previousRound.solution = room.solution 
	room.previousRound.attempts = room.attempts
	room.previousRound.accuracyHints = room.accuracyHints
	room.users[0].reviewingPreviousRound = true
	room.users[1].reviewingPreviousRound = true

	room.attempts = attemptsDefault
	room.solution = solutionDefault
	room.accuracyHints = accuracyHintsDefault

	await room.save()
}

exports.updateUserReviewingPreviousRound = async (roomId, newReviewState, userId = null) => {
	const room = await Room.findOne({ '_id': roomId })

	if (userId !== null) {
		const userIndex = room.users.findIndex(user => user.id === userId)
		room.users[userIndex].reviewingPreviousRound = newReviewState
		await room.save()
		return
	}

	room.users.forEach((user, index) => {
		room.users[index].reviewingPreviousRound = newReviewState
	})
	await room.save()
}

exports.deleteRooms = async function () {
	const count = await Room.deleteMany({})
	console.log(count);
}

// HELPERS
// validate the new attempt
function codeSetValidator(codePiece) {
	return this.codeSet.includes(codePiece)
}

function isSolutionSet(solution) {
	return JSON.stringify(solution) !== JSON.stringify(['','','',''])
}

// give hints according to attempt accuracy
const getAccuracyHint = async (solution, attempt) => {
	let solutionCopy = solution.slice()
	let correctPieceCount = 0
	let correctPositionCount = 0

	for (let index = 0; index < attempt.length; index++) {
		const piece = attempt[index]
		const indexOfAttemptPiece = solutionCopy.indexOf(piece)

		if (indexOfAttemptPiece > -1) {	// if the solutions includes the attemptPiece then count it as a correct piece and remove it from the copy
			correctPieceCount++
			solutionCopy.splice(indexOfAttemptPiece, 1)
		}

		if (piece === solution[index]) { // if the code piece is the same for both attempt and solution at the same index
			correctPositionCount++
		}
	}
	
	return { correctPieceCount, correctPositionCount }
}