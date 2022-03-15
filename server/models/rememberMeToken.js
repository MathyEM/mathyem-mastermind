const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rememberMeTokenSchema = new Schema({
  user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
})

const RememberMeToken = mongoose.model('RememberMeToken', rememberMeTokenSchema)
module.exports = RememberMeToken