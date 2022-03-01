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
		const userId = socket.request.user.id
		const room = await Room.findById(id)
	
		const userAlreadyJoined = await room.users.find((user) => {
			if (user.id === userId) {
				return true
			}
			return false
		})
		
		if (userAlreadyJoined) { //  if the user is already in the room
			return { status: false, message: 'You are already in this room'}
		}
	
		if (room.users.length >= 2) {
			return { status: false, message: 'This room is full'}
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
	return { status: true, solution }
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

	if (calculateAttemptIndex(room.attempts) !== attemptIndex) {
		return { status: false, message: "your current attempt does not match the server's" }
	}

	// check validity of the attempt according to the codeSet
	if (!attempt.every(codeSetValidator, room)) {
		return { status: false, message: 'attempt does not match code set' }
	}
	
	room.attempts[attemptIndex] = attempt
	await room.save()

	// give hints according to attempt accuracy
	const getAccuracyHints = (solution, attempt) => {
		let correctPositionCount = 0
		let correctPieceCount = 0
		let matchedAttemptPieces = [] // each attemptPieceIndex that has already been discovered will be pushed to this array

		for (let solutionIndex = 0; solutionIndex < solution.length; solutionIndex++) {
			const solutionPiece = solution [solutionIndex]

			if (matchedAttemptPieces.length === 4) { // check if all attemptPieces have been matched before continuing
				break
			}

			for (let attemptIndex = 0; attemptIndex < attempt.length; attemptIndex++) {
				const attemptPiece = attempt[attemptIndex]

				if (!solution.includes(attemptPiece)) { // if the attemptPiece is not anywhere in the solution
					continue
				}

				if (matchedAttemptPieces.includes(attemptIndex)) { // first check if this attemptPiece has already been matched
					continue
				}

				if (solution[attemptIndex] === attemptPiece) { // check if the attemptPiece is in the correct position
					correctPieceCount++
					correctPositionCount++
					matchedAttemptPieces.push(attemptIndex)
					break
				}

				if (solutionPiece === attemptPiece) { // if all other checks don't match, then this must
					correctPieceCount++
					matchedAttemptPieces.push(attemptIndex)
					break
				}
			}
		
		}

		return { correctPieceCount, correctPositionCount }
	}

	const accuracyHints = getAccuracyHints(room.solution, attempt)

	const attempts = room.attempts

	var gameOver = false

	if (attemptIndex === 0 || accuracyHints.correctPositionCount === 4) {
		gameOver = true
	}

	return { attempts, attemptIndex, accuracyHints, gameOver }
}

exports.completeRound = async (socket, roomId, attemptIndex) => {
	const userId = socket.request.user._id
	const room = await Room.findOne({ 'users._id': userId, '_id': roomId })

	
	const newCodeMaker = room.users.find(user => !user._id.equals(room.currentCodeMaker._id))
	const codeBreakerIndex = room.users.findIndex(user => user.id !== room.currentCodeMaker.id)
	
	room.users[codeBreakerIndex].points += attemptIndex+1
	
	room.currentCodeMaker = newCodeMaker._id
	await room.save()
	await exports.resetRoom(roomId)
}

exports.resetRoom = async (roomId) => {
	const room = await Room.findOne({ '_id': roomId })
	const attemptsDefault = Room.schema.paths.attempts.options.default
	const solutionDefault = Room.schema.paths.solution.options.default

	room.attempts = attemptsDefault
	room.solution = solutionDefault

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

function calculateAttemptIndex(attempts) {
	if(attempts) {
		const index = attempts.filter(attempt => {
			return attempt.includes('')
		})
		return index.length-1
	}
	return null
}

const indexesOf = (arr, item) => 
  arr.reduce(
    (acc, v, i) => (v === item && acc.push(i), acc),
  []);