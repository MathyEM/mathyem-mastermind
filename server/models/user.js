const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please Include your email"]
  }
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)
module.exports = User