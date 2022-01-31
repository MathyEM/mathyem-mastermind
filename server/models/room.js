const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	wins: {
		type: Number,
		default: 0,
	}
})

const roomSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	name: String,
	solution: {
		type: Array,
		required: true,
		default: ['','','','']
	},
	attempts: {	// USe this to update Array in mongoose Schema: Room.attempts.set(0, [1, 2, 2, 3]) to set index 0 in the array.
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
	users: {
		type: [usersSchema],
		validate: [usersLimit, '{PATH} exceeds the limit of 2 users']
	},
	currentCodemaker: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	codeSet: {
		type: Array,
		default: ['1', '2', '3', '4']
	}
}, {
	timestamps: true
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