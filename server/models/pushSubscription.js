const mongoose = require("mongoose")
const Schema = mongoose.Schema

const pushSubscriptionSchema = mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscription: {
    type: Object,
    required: true,
  }
})


const PushSubscription = mongoose.model("PushSubscription", pushSubscriptionSchema)
module.exports = PushSubscription