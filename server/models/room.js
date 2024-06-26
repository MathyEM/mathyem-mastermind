const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	points: {
		type: Number,
		default: 0,
	},
	reviewingPreviousRound: {
		type: Boolean,
		default: false,
	}
})

const previousRoundSchema = new Schema({
	solution: {
		type: Array,
		required: true,
		default: ['','','','']
	},
	attempts: {
		type: [Array],
		required: true,
		default: [
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','','']
		]
	},
	accuracyHints: {
		type: Array,
		required: true,
		default: [
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}
		]
	},
})

const roomSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: {
		type: String,
		minLength: 3,
    maxLength: 24,
	},
	solution: {
		type: Array,
		required: true,
		default: ['','','','']
	},
	attempts: {
		type: [Array],
		required: true,
		default: [
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','',''],
			['','','','']
		]
	},
	accuracyHints: {
		type: Array,
		required: true,
		default: [
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{},
			{}
		]
	},
	users: {
		type: [usersSchema],
		validate: [usersLimit, '{PATH} exceeds the limit of 2 users']
	},
	currentCodeMaker: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	codeSet: {
		type: Array,
		default: ['1', '2', '3', '4']
	},
	previousRound: {
		type: previousRoundSchema,
		default: () => ({})
	}
}, {
	timestamps: true
})

roomSchema.virtual('attemptIndex').get(function() {
	const attempts = this.attempts
	const index = attempts.filter(attempt => {
		return attempt.includes('')
	})
	return index.length-1
})

function usersLimit(val) {
	return val.length <= 2
}

const anonymousRoom = roomSchema.clone()
anonymousRoom.index({
	createdAt: 1
},
{
	expires: '1d'
})



const Room = mongoose.model('Room', roomSchema)
const AnonymousRoom = mongoose.model('AnonymousRoom', anonymousRoom)
const UsersSchema = mongoose.model('UsersSchema', usersSchema)
module.exports = { Room, AnonymousRoom }