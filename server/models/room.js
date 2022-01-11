const mongoose = require("mongoose")
const Schema = mongoose.Schema


const roomSchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	solution: Array,
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
	users: [{
		user: {type: Schema.Types.ObjectId, ref: 'User'},
		wins: {
			type: Number,
			default: 0,
		},

	}],
	codeSet: {
		type: Array,
		default: [1, 2, 3, 4]
	}
})


const Room = mongoose.model("Room", roomSchema)
module.exports = Room