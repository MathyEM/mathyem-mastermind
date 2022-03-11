const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Include a username"],
    minLength: 3,
    maxLength: 16,
    match: [/^[a-z0-9]+$/i, 'Your username may only contain alphanumeric characters']
  },
  email: {
    type: String,
    required: [true, "Please Include your email"],
    lowercase: true,
    index: {unique: true, dropDups: true},
    match: [/^.+@(?:[\w-]+\.)+\w+$/, 'Please use a valid email']
  }
})

passwordValidator = function(password,cb) {
  const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[._-])[0-9a-zA-Z._-]+$/)
  if (!regex.test(password)) {
    return cb('password does not match the regex')
  }
  // return an empty cb() on success
  return cb()
}

userSchema.plugin(passportLocalMongoose, {usernameCaseInsensitive: true, passwordValidator})

const User = mongoose.model("User", userSchema)
module.exports = User