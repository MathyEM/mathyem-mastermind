const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Include your email"],
    index: {unique: true, dropDups: true},
  }
})

userSchema.plugin(passportLocalMongoose, {usernameCaseInsensitive: true})

const User = mongoose.model("User", userSchema)
module.exports = User