const User = require("../models/user")

exports.registerNewUser = async (req, res) => {
	console.log('trying to register new user')
	const username = req.body.username
	const email = req.body.email
	const password = req.body.password
	
	//Check for existing user
	try {
		const userExists = await User.findOne({
			$or: [
				{ email: email },
				{ username: username }
			]
		}).exec()
	
		if (userExists) {
			console.log('user already exists')
			return res.status(409).json({ message: 'username or email already in' })
		}
	} catch (error) {
		console.log(error);
	}
	
	const user = new User({
		username,
		email,
		password
	})
	try {
		let data = await user.save()
		return res.status(201).json({ message: 'Registration successful', data })	
	} catch (error) {
		console.log(error);
	}
}
exports.loginUser = async (req, res) => {};
exports.getUserDetails = async (req, res) => {};